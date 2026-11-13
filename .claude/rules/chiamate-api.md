---
paths:
  - 'src/app/**/*.ts'
---

# Chiamate al backend

Esempio di riferimento: il login (`AuthService.authenticate()` e `LoginForm`). Ogni chiamata segue lo stesso schema.

## Il percorso di una chiamata

1. **Componente** (`LoginForm`): nell'`action` del form chiama il servizio con `firstValueFrom()` dentro una funzione `async` e `.then(successo, (error: ApiErrorResponse) => ...)`. Mai `subscribe()`.
2. **Servizio della feature** (`AuthService`): fa la richiesta con `HttpClient`, estrae il `result`, aggiorna lo stato con `tap()` e converte l'errore HTTP in `ApiErrorResponse` con `catchError()`. Restituisce un `Observable` con il solo dato utile.
3. **Backend**: risponde sempre con la busta `ApiResponse<T>`.
4. **Errore**: il secondo argomento del `.then` riceve un `ApiErrorResponse` (stato, codice, messaggio) e lo passa a `ApiErrorService.handle(error, fallback)`, che mostra un toast.

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
await firstValueFrom(this._authService.authenticate(this._model())).then(
  () => this._onLoginSuccess(),
  (error: ApiErrorResponse) =>
    this._apiError.handle(error, {
      summary: 'login.serverError.summaryKo',
      detail: 'login.serverError.detailKo',
    }),
);
```

L'errore è tipizzato con `.then(ok, (error: ApiErrorResponse) => ...)` e non con un `catch`: TypeScript permette nel `catch` solo `unknown` o `any`. L'annotazione è una promessa, non un controllo: `ApiErrorService.handle` accetta `unknown` e, se non è un `ApiErrorResponse`, mostra il messaggio di default.

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
- Gli indirizzi sono relativi (`/auth/login`), con il gruppo in una proprietà privata (`private readonly _apiGroup = '/auth'`). I dati viaggiano nel body o nella query string: vedi «Body o query string».
- Il metodo restituisce `Observable<XxxResponse>`: toglie la busta con `map((response) => response.result)`. Gli effetti sullo stato (utente, sessione, storage) stanno in `tap()` dentro il servizio, non nel componente.
- Il servizio **non mostra gli errori** (lo fa chi ha lanciato la chiamata), ma **li converte**: `catchError((response: HttpErrorResponse) => throwError(() => ApiErrorResponse.fromHttpError(response)))` (`shared/utils/api-error-response`). Così chi chiama riceve un `ApiErrorResponse` con `status`, `code` e `message`, non un `HttpErrorResponse` grezzo. Ogni metodo che fa una richiesta ha il suo `catchError`.
- Finché il backend non c'è, i dati restano simulati nel servizio con un `// TODO(api): ...` che dice cosa sostituire (endpoint e metodo).
- Gli interceptor (token, lingua, ...) si registrano con `provideHttpClient(withInterceptors([...]))` in `core/providers/core/core.provider.ts`.

## Errori

- **Ogni gestione dell'errore di una chiamata (il secondo argomento del `.then`) chiama `ApiErrorService.handle(error, fallback)`** (`shared/services/api-error`). `fallback` ha le chiavi Transloco `summary` e `detail` del messaggio di default, nel gruppo della feature (`login.serverError.summaryKo`, `login.serverError.detailKo`).
- `ApiErrorResponse.fromHttpError` legge codice e messaggio dal corpo della risposta (la busta `ApiResponse` o un `ApiError`); senza corpo valido (rete, errore del server) il codice è vuoto e il messaggio è quello di `HttpClient`. `ApiErrorService` guarda `error.code`: se è in `API_ERROR_MESSAGES` mostra il suo messaggio, altrimenti il default della chiamata. Un errore che non è un `ApiErrorResponse` (un bug, un `throw`) mostra sempre il default.
- **Un codice nuovo**: voce in `API_ERROR_MESSAGES` (`shared/constants/api-error.const.ts`, codice → gruppo), chiavi `apiError.<gruppo>.summaryKo` e `detailKo` in `it.json` **e** `en.json`, e il caso nello spec di `ApiErrorService`. Un testo specifico di una sola chiamata non va nel servizio: è il suo messaggio di default.
- Un errore che appartiene a un campo si restituisce dall'`action` del form (`{ fieldTree, kind, message }`, `form.md`); gli altri vanno nel toast. L'`action` restituisce `undefined` anche dopo un errore già mostrato.
- Niente `if (error.status === 401)` nei componenti: il significato dell'errore sta nel codice.

## Test

- **Servizio**: `provideHttpClient()` + `provideHttpClientTesting()`, `HttpTestingController.expectOne('/auth/login')`, si controllano metodo e body, si risponde con `flush(busta)` e alla fine `http.verify()`. La busta di una risposta riuscita è `{ error: { code: '', message: '' }, result }`; un errore si prova con `flush({ error: { code, message }, result: null }, { status: 401, statusText: 'Unauthorized' })` e con `.error(new ProgressEvent('error'))` per la rete (stato 0), controllando che l'errore sia un `ApiErrorResponse` con `status` e `code` giusti.
- **Componente**: `vi.spyOn(servizio, 'authenticate').mockReturnValue(subject)` con un `Subject` per decidere quando la chiamata risponde; per l'errore un `new ApiErrorResponse(status, code, message)`. Si controlla `ToastService.error` con le chiavi del codice o del messaggio di default.
