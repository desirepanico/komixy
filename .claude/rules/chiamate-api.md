---
paths:
  - 'src/app/**/*.ts'
---

# Chiamate al backend

Esempio di riferimento: il login (`AuthService.authenticate()` e `LoginForm`). Ogni chiamata segue lo stesso schema.

## Il percorso di una chiamata

1. **Componente** (`LoginForm`): nell'`action` del form chiama il servizio con `firstValueFrom()` dentro una funzione `async`, in un `try/catch`. Mai `subscribe()`.
2. **Servizio della feature** (`AuthService`): fa la richiesta con `HttpClient`, estrae il `result`, aggiorna lo stato con `tap()` e converte l'errore HTTP in `ApiErrorResponse` con `catchError()`. Restituisce un `Observable` con il solo dato utile.
3. **Backend**: risponde sempre con la busta `ApiResponse<T>`.
4. **Errore**: il `catch` controlla con `instanceof ApiErrorResponse` (stato, codice, messaggio) e passa l'errore, o `null` se non viene dall'API, a `ApiErrorService.handle(error, fallback)`, che mostra un toast.

```ts
// auth.service.ts
public authenticate(credentials: LoginRequest): Observable<LoginResponse> {
  return this._http.post<ApiResponse<LoginResponse>>(`${this._apiGroup}/login`, credentials).pipe(
    map((response) => response.result),
    tap((user) => this.login(user)),
    catchError((response: HttpErrorResponse) =>
      throwError(() => ApiErrorResponse.fromHttpError(response)),
    ),
  );
}

// login-form.ts
try {
  await firstValueFrom(this._authService.authenticate(this._model()));
  this._onLoginSuccess();
} catch (error) {
  this._apiError.handle(error instanceof ApiErrorResponse ? error : null, {
    summary: 'login.serverError.summaryKo',
    detail: 'login.serverError.detailKo',
  });
}
```

Nel `catch` TypeScript non permette un tipo preciso (solo `unknown` o `any`, perché si può lanciare qualsiasi cosa): si scrive `catch (error)` senza annotazione e si restringe con `instanceof`. Così il tipo passato a `ApiErrorService.handle` è controllato davvero: `ApiErrorResponse` se l'errore viene dall'API, `null` se è altro (un bug), e in quel caso compare il messaggio di default.

### Mentre si aspetta la risposta

- `await` sospende solo l'`action` del form, non l'app: la pagina resta libera. `firstValueFrom()` si iscrive all'`Observable`, parte la richiesta, e prende il primo valore annullando l'iscrizione (`HttpClient` ne emette uno solo, quindi non resta nulla di aperto).
- Finché l'`action` non finisce `form().submitting()` è `true`: il bottone di invio è disabilitato (`login.submitting`). A risposta arrivata, in qualunque esito, torna `false` e si può riprovare.
- **Riuscita**: `map`, `tap` e `firstValueFrom` si risolve, l'esecuzione prosegue dopo l'`await` (`_onLoginSuccess()`). **Errore**: il `catchError` del servizio lo converte, `firstValueFrom` rifiuta e si salta nel `catch`.
- Un `Observable` che si chiude senza emettere fa rifiutare `firstValueFrom` con un `EmptyError`: finisce nel `catch` e, non essendo un `ApiErrorResponse`, mostra il messaggio di default.

### Skeleton mentre la chiamata è in corso

Quando una pagina o un componente carica dati dal backend mostra `app-skeleton` al posto del contenuto finché la chiamata non finisce (regole in `skeleton.md`). Il segnale è un `loading` che accende chi lancia la chiamata:

```ts
// comics-page.ts
protected readonly loading = signal<boolean>(true);
protected readonly comics = signal<ComicListResponse | null>(null);

private async _load(): Promise<void> {
  this.loading.set(true);
  try {
    this.comics.set(await firstValueFrom(this._comicsService.list(this._filters())));
  } catch (error) {
    this._apiError.handle(error instanceof ApiErrorResponse ? error : null, {
      summary: 'comics.loadError.summaryKo',
      detail: 'comics.loadError.detailKo',
    });
  } finally {
    this.loading.set(false);
  }
}
```

```html
<!-- comics-page.html: l'anello è sul contenitore, lo skeleton ha le misure del contenuto vero -->
<section [attr.aria-busy]="loading()">
  @if (loading()) {
  <app-skeleton class="h-48 w-full" />
  } @else {
  <!-- contenuto -->
  }
</section>
```

- `loading` si accende **prima** della chiamata e si spegne nel `finally`: così lo skeleton sparisce anche in caso di errore e non resta mai acceso.
- Una chiamata all'apertura della pagina parte dal costruttore (`void this._load()`); una che dipende dai filtri nell'indirizzo riparte quando cambiano (query param, `query-params.md`).
- Lo skeleton è per **caricare dati da mostrare**. Un invio di form (come il login) non usa lo skeleton: il bottone si disabilita con `form().submitting()`.
- Più dati caricati insieme condividono un solo `loading`; non uno skeleton per ogni richiesta.
- Per un caricamento semplice senza busta né `ApiErrorResponse` si può usare `resource()`/`httpResource()`, che ha già `isLoading()` (`signals.md`).

## Body o query string

I dati di una chiamata viaggiano in uno di questi tre posti, secondo ciò che sono:

| Cosa                                                           | Dove                                   | Quando                                | Modello    |
| -------------------------------------------------------------- | -------------------------------------- | ------------------------------------- | ---------- |
| Dati da inviare o modificare (credenziali, i campi di un form) | **body** (secondo argomento di `post`) | `POST`, `PUT`, `PATCH`                | `*Request` |
| Filtri, ordinamento, pagina di una lista                       | **query string**, con `apiUrl()`       | `GET` (anche `DELETE` con filtri)     | `*Filters` |
| Quale risorsa (un volume, un utente)                           | **percorso** dell'indirizzo            | sempre: `` `/comics/${id}` ``         | -          |
| Cancellare una risorsa                                         | **percorso**, senza body               | `DELETE`: `` `/me/bookmarks/${id}` `` | -          |

- **Il login usa il body**: `POST /auth/login` con `LoginRequest` (`{ email, password }`) come secondo argomento di `post()`. Le credenziali non vanno mai nell'indirizzo, che finisce nei log del server, nella cronologia e nei link condivisi. Vale per ogni dato personale o segreto: sempre nel body, mai nella query string.
- **I filtri usano `apiUrl()`** (`shared/utils/api-url`): si passa un oggetto e diventa la query string, già codificata (`qs`). Senza filtri l'indirizzo resta com'è.
- **`DELETE`**: la risorsa da cancellare si indica nel percorso (`DELETE /me/bookmarks/${comicId}`) e la chiamata non ha body, perché alcuni server e proxy lo ignorano. Solo una cancellazione in blocco con un criterio (tutti i segnalibri di un genere) usa la query string con `apiUrl()`, come `*Filters`.
- Regola pratica: se la chiamata **cambia** qualcosa sul server, i dati vanno nel body; se **legge** una lista e restringe quello che torna, vanno in `apiUrl()`. Una `GET` non ha body.

```ts
// body: la chiamata invia dati
this._http.post<ApiResponse<LoginResponse>>(`${this._apiGroup}/login`, credentials); // LoginRequest

// query string: la chiamata legge una lista filtrata
this._http.get<ApiResponse<ComicListResponse>>(apiUrl('/comics', filters)); // ComicListFilters
// apiUrl('/comics', { genre: 'manga', page: 2 })  →  '/comics?genre=manga&page=2'
```

## Modelli

- In un `*.model.ts` della feature (`features/auth/models/auth.model.ts`): il body inviato finisce per `Request` (`LoginRequest`), la risposta, cioè il `result` di `ApiResponse<T>`, per `Response` (`LoginResponse`), i filtri della query string per `Filters`. Se la chiamata serve a più feature stanno in `shared/models`.
- La busta comune è in `shared/models/api-response.model.ts`: `ApiResponse<T> { error: ApiError; result: T }` e `ApiError { code; message }`.

## Servizio

- Il servizio sta nella feature che lo usa (`services/<nome>/<nome>.service.ts`), in `shared/services` se lo usano più feature. Una sola responsabilità, `providedIn: 'root'`, `inject(HttpClient)`.
- Gli indirizzi sono relativi e iniziano con `/` (`/auth/login`), con il gruppo in una proprietà privata (`private readonly _apiGroup = '/auth'`): il `baseUrlInterceptor` ci mette davanti l'`apiUrl` dell'environment, quindi nei servizi non va mai scritto un indirizzo completo né `environment.apiUrl`. I dati viaggiano nel body o nella query string: vedi «Body o query string».
- Il metodo restituisce `Observable<XxxResponse>`: toglie la busta con `map((response) => response.result)`. Gli effetti sullo stato (utente, sessione, storage) stanno in `tap()` dentro il servizio, non nel componente.
- Il servizio **non mostra gli errori** (lo fa chi ha lanciato la chiamata), ma **li converte**: `catchError((response: HttpErrorResponse) => throwError(() => ApiErrorResponse.fromHttpError(response)))` (`shared/utils/api-error-response`). Così chi chiama riceve un `ApiErrorResponse` con `status`, `code` e `message`, non un `HttpErrorResponse` grezzo. Ogni metodo che fa una richiesta ha il suo `catchError`.
- Finché il backend non c'è, i dati restano simulati nel servizio con un `// TODO(api): ...` che dice cosa sostituire (endpoint e metodo).
- Ciò che serve a tutte le chiamate lo fanno gli interceptor di `core/interceptors`, registrati in `provideHttp()`: indirizzo di base (`baseUrlInterceptor`), fuso orario (`timezoneInterceptor`, `X-Timezone`), token (`bearerTokenInterceptor`, `Authorization: Bearer`) e sessione scaduta (`tokenExpiredInterceptor`, un 401 a un iscritto fa uscire e diventa `SESSION_EXPIRED`). Il servizio non aggiunge a mano intestazioni, token o fuso, e per un 401 di sessione scaduta non fa nulla: `catchError` e `ApiErrorService` mostrano già il messaggio. Cosa fa ciascuno e perché: `docs/architettura.md`. Un interceptor nuovo si aggiunge in `core/interceptors/<nome>/` (con lo spec) e a `provideHttp()`, e se tocca l'intestazione di una chiamata controlla `req.context.get(IS_API_REQUEST)` (messo dal `baseUrlInterceptor`, che deve restare il primo) per non mandarla a siti di terzi. Non si creano file di aiuto accanto agli interceptor: la logica sta nell'interceptor.

## Errori

- **Ogni `catch` di una chiamata chiama `ApiErrorService.handle(error, fallback)`** (`shared/services/api-error`). `fallback` ha le chiavi Transloco `summary` e `detail` del messaggio di default, nel gruppo della feature (`login.serverError.summaryKo`, `login.serverError.detailKo`).
- `ApiErrorResponse.fromHttpError` legge codice e messaggio dal corpo della risposta (la busta `ApiResponse` o un `ApiError`); senza corpo valido (rete, errore del server) il codice è vuoto e il messaggio è quello di `HttpClient`. `ApiErrorService` guarda `error.code`: se è in `API_ERROR_MESSAGES` mostra il suo messaggio, altrimenti il default della chiamata. Con `null` (un errore che non viene dall'API: un bug, un `throw`) mostra sempre il default.
- **Un codice nuovo**: voce in `API_ERROR_MESSAGES` (`shared/constants/api-error.const.ts`, codice → gruppo), chiavi `apiError.<gruppo>.summaryKo` e `detailKo` in `it.json` **e** `en.json`, e il caso nello spec di `ApiErrorService`. Un testo specifico di una sola chiamata non va nel servizio: è il suo messaggio di default.
- Un errore che appartiene a un campo si restituisce dall'`action` del form (`{ fieldTree, kind, message }`, `form.md`); gli altri vanno nel toast. L'`action` restituisce `undefined` anche dopo un errore già mostrato.
- Niente `if (error.status === 401)` nei componenti: il significato dell'errore sta nel codice.

## Test

- **Servizio**: `provideHttpClient()` + `provideHttpClientTesting()`, `HttpTestingController.expectOne('/auth/login')`, si controllano metodo e body, si risponde con `flush(busta)` e alla fine `http.verify()`. La busta di una risposta riuscita è `{ error: { code: '', message: '' }, result }`; un errore si prova con `flush({ error: { code, message }, result: null }, { status: 401, statusText: 'Unauthorized' })` e con `.error(new ProgressEvent('error'))` per la rete (stato 0), controllando che l'errore sia un `ApiErrorResponse` con `status` e `code` giusti.
- **Componente**: `vi.spyOn(servizio, 'authenticate').mockReturnValue(subject)` con un `Subject` per decidere quando la chiamata risponde; per l'errore un `new ApiErrorResponse(status, code, message)`. Si controlla `ToastService.error` con le chiavi del codice o del messaggio di default.
