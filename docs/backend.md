# Contratto con il backend

Cosa il frontend manda e cosa si aspetta in risposta, scritto per chi sviluppa il backend. Il codice che lo implementa è in `core/interceptors/`, `shared/services/api-error/` e nei servizi delle feature; le regole per scrivere una chiamata sono in `.claude/rules/chiamate-api.md`.

## Indirizzo

Il frontend chiama indirizzi che iniziano con `/` (`/auth/login`): `baseUrlInterceptor` ci mette davanti l'`apiUrl` dell'ambiente (`src/environments/`, vedi `sviluppo.md`).

| Ambiente | Come si avvia       | Indirizzo del backend                                 |
| -------- | ------------------- | ----------------------------------------------------- |
| Locale   | `npm start`         | `http://localhost:3000`                               |
| Dev      | `npm run start:dev` | `https://INSERIRE_URL_API_DEV` (da sostituire)        |
| Prod     | build di produzione | `https://INSERIRE_URL_API_PRODUZIONE` (da sostituire) |

Il frontend è su un altro indirizzo (`http://localhost:4200`, Vercel), quindi il backend deve abilitare **CORS** per quegli indirizzi. Le intestazioni personalizzate qui sotto fanno partire una richiesta preliminare `OPTIONS`: il backend deve rispondere con `Access-Control-Allow-Headers: Authorization, Content-Type, X-Timezone, X-Guest-Id`.

## Formato delle risposte

Ogni risposta ha la stessa busta (`ApiResponse<T>`):

```json
{ "error": { "code": "", "message": "" }, "result": { ... } }
```

- **Riuscita** (200/201...): `result` con i dati, `error` con `code` e `message` vuoti.
- **Fallita** (4xx/5xx): lo stato HTTP giusto e la stessa busta con `result: null` e l'errore compilato:

```json
{ "error": { "code": "INVALID_CREDENTIALS", "message": "Credenziali non valide" }, "result": null }
```

Il frontend usa il **`code`** per scegliere il messaggio da mostrare (tradotto in italiano e inglese nei suoi file); il `message` serve a chi legge i log e non compare all'utente. Un errore senza `code`, o con un codice che non conosce, mostra il messaggio generico della schermata.

## Intestazioni che manda il frontend

Solo alle chiamate al backend, mai a siti di terzi.

| Intestazione    | Quando              | Valore                       | A cosa serve                                                                                                                       |
| --------------- | ------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `Authorization` | utente **iscritto** | `Bearer <token>`             | Il token ricevuto al login. Identifica l'utente: il backend lo verifica a ogni chiamata                                            |
| `X-Guest-Id`    | utente **ospite**   | UUID v4, es. `3f2c…`         | Identifica un ospite anonimo (vedi «Utente ospite»)                                                                                |
| `X-Timezone`    | sempre              | fuso IANA, es. `Europe/Rome` | Il fuso del browser: «oggi», l'inizio della settimana (la busta settimanale) e le date delle uscite dipendono dal fuso dell'utente |
| `Content-Type`  | con un body         | `application/json`           | Il body delle `POST`, `PUT`, `PATCH` è JSON                                                                                        |

## Autenticazione

### `POST /auth/login`

Body (JSON, `LoginRequest`):

```json
{ "email": "demo@example.com", "password": "password1" }
```

Risposta 200 (`result` = `LoginResponse`):

```json
{
  "error": { "code": "", "message": "" },
  "result": { "id": "1", "email": "demo@example.com", "userRole": 1, "token": "<token>" }
}
```

- **`token`** è il campo che il frontend cerca con questo nome esatto: lo conserva e lo manda come `Authorization: Bearer <token>`. Se il backend lo chiama in un altro modo (`accessToken`, ...) va allineato il frontend (`LoginResponse` in `features/auth/models/auth.model.ts`).
- **`userRole`** è un **numero**, non una stringa: `0` = admin, `1` = utente (`UserRole` in `shared/models/user-role.model.ts`).
- Credenziali sbagliate: **401** con `code: "INVALID_CREDENTIALS"`. Il frontend non esce né cambia pagina: mostra l'errore (l'utente non è ancora iscritto).
- Le credenziali viaggiano **solo nel body**, mai nell'indirizzo.

### Token scaduto o non valido

Quando il token non vale più il backend risponde **401** a una chiamata con `Authorization`. Il frontend allora fa uscire l'utente (toglie il token e porta al login) e mostra «Sessione scaduta». Se la risposta ha già un `code` (`SESSION_EXPIRED` o `UNAUTHORIZED`) il frontend lo tiene; se non ce l'ha, usa `SESSION_EXPIRED`. Un 401 a un ospite non fa uscire nessuno.

Per ora non c'è un rinnovo del token (refresh token): alla scadenza l'utente rifà il login.

> **Da decidere con il backend.** Il token è oggi nello `localStorage` del browser (`komixy.token`), leggibile da qualunque script della pagina. La soluzione più sicura è un cookie `httpOnly` impostato dal backend: in quel caso il frontend non vedrebbe più il token e invierebbe le chiamate con `withCredentials`, e il backend dovrebbe configurare CORS con le credenziali. Nel codice è un `TODO(api)` (`form.const.ts`).

## Utente ospite

Chi entra con «Entra come ospite» (o non ha fatto il login) non ha un account: può guardare la classifica, aprire la busta e vedere i dettagli, ma **non può salvare** nelle liste. Il frontend gli dà un identificativo anonimo:

- è un **UUID v4** creato dal browser la prima volta e conservato (`komixy.guestId` nello `localStorage`); resta lo stesso finché l'utente non cancella i dati del browser, anche dopo un login e un'uscita;
- si manda in **`X-Guest-Id`** a ogni chiamata dell'ospite, **al posto** del token. Anche la chiamata di login lo porta (l'utente è ancora un ospite): il backend può usarlo per **trasferire sull'account i dati dell'ospite** (per esempio l'apertura della busta della settimana);
- non è un segreto né una prova di identità: serve solo a contare e ritrovare dati anonimi. Non vale come autenticazione.

Cosa deve fare il backend con un ospite:

| Cosa                                            | Comportamento atteso                                                                                                                                                                       |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Letture pubbliche (classifica, dettagli, busta) | Rispondere normalmente, anche senza `Authorization`                                                                                                                                        |
| **Busta settimanale**                           | Registrare **una apertura per settimana ISO** per `user_id` (iscritto) o `guest_id` (ospite), nel fuso di `X-Timezone`. Oggi il frontend la ricorda solo nel browser (`komixy.weeklyPack`) |
| Scritture nelle liste (segnalibri, libreria)    | Rifiutare un ospite con **401** (`UNAUTHORIZED`) o **403** (`FORBIDDEN`). Il frontend non offre già il comando, ma il backend deve comunque difendersi                                     |

## Codici di errore

Elenco dei `code` che il frontend riconosce (`API_ERROR_MESSAGES` in `shared/constants/api.const.ts`). Lo stato HTTP è quello consigliato.

| `code`                 | Stato | Quando                                                 |
| ---------------------- | ----- | ------------------------------------------------------ |
| `INVALID_CREDENTIALS`  | 401   | Email o password sbagliate                             |
| `UNAUTHORIZED`         | 401   | Serve l'accesso (nessun token, o un ospite che scrive) |
| `SESSION_EXPIRED`      | 401   | Il token è scaduto                                     |
| `FORBIDDEN`            | 403   | L'utente non ha i permessi                             |
| `NOT_FOUND`            | 404   | La risorsa non esiste                                  |
| `EMAIL_ALREADY_EXISTS` | 409   | Esiste già un account con questa email (registrazione) |
| `VALIDATION_ERROR`     | 422   | I dati inviati non sono validi                         |
| `TOO_MANY_REQUESTS`    | 429   | Troppi tentativi                                       |
| `SERVER_ERROR`         | 500   | Errore del server                                      |

Un codice nuovo si concorda qui: il frontend aggiunge la voce a `API_ERROR_MESSAGES` e le traduzioni (`apiError.*`). Finché non le conosce, mostra il messaggio generico.

## Dati inviati: body e query string

| Cosa                                                        | Dove                        | Metodi                        |
| ----------------------------------------------------------- | --------------------------- | ----------------------------- |
| Dati da creare o modificare (credenziali, campi di un form) | **body** JSON               | `POST`, `PUT`, `PATCH`        |
| Filtri, ordinamento, pagina di una lista                    | **query string**            | `GET`                         |
| Quale risorsa                                               | **percorso** (`/comics/42`) | tutti                         |
| Cancellare una risorsa                                      | **percorso**, senza body    | `DELETE` (`/me/bookmarks/42`) |

- I filtri passano da `qs`: un oggetto diventa `?genre=manga&page=2`; gli array e gli oggetti annidati usano le parentesi (`?genre[0]=manga&genre[1]=seinen`, `?filters[author]=Oda`).
- Una `DELETE` non ha body. Solo una cancellazione in blocco con un criterio usa la query string.

## Endpoint

| Endpoint                                                                | Stato      | Note                                                                                  |
| ----------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------- |
| `POST /auth/login`                                                      | **in uso** | Descritto sopra                                                                       |
| `PUT /me/bookmarks/:comicId`                                            | previsto   | Salva un volume nella libreria dell'iscritto (`BookmarksService`)                     |
| `DELETE /me/bookmarks/:comicId`                                         | previsto   | Toglie un volume dalla libreria                                                       |
| Apertura della busta settimanale                                        | previsto   | Una per settimana ISO, per `user_id` o `guest_id` (`WeeklyPackService`)               |
| Classifica della settimana, «Manga da scoprire», dettaglio di un volume | previsto   | Dati oggi simulati nei servizi (`WeeklyRankingService`, `ComicCatalogService`)        |
| Registrazione, accesso con Google e Apple                               | previsto   | La pagina di registrazione è un segnaposto; l'accesso social è simulato (`TODO(api)`) |

Forma delle risposte e dei campi: da definire insieme al backend quando si collega ogni schermata. I modelli sono in `shared/models/` (`comic.model.ts`, `ranking-entry.model.ts`) e nei `models/` delle feature; i nomi seguono la convenzione `Request`, `Response`, `Filters`.
