# Contratto con il backend

Cosa il frontend manda e cosa si aspetta in risposta, scritto per chi sviluppa il backend. Il codice che lo implementa è in `core/interceptors/`, `shared/services/api-error/` e nei servizi delle feature; le regole per scrivere una chiamata sono in `.claude/rules/chiamate-api.md`.

**Come leggerlo**

| Parte                                  | Cosa trovi                                                                                                                                                  | Per chi               |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| **Contratto comune**                   | Indirizzo, formato delle risposte, intestazioni, dati inviati, codici di errore                                                                             | Sempre                |
| **Gestione dell'autenticazione**       | Come scegliere tra il **Flusso 1** (senza Firebase) e il **Flusso 2** (con Firebase), il dettaglio di ciascuno, e ciò che vale per entrambi (ruolo, ospite) | Sempre                |
| **Sicurezza del backend**              | La procedura corretta per proteggere le chiamate                                                                                                            | Chi scrive il backend |
| **Endpoint**                           | Le chiamate in uso e quelle previste                                                                                                                        | Sempre                |
| **Privacy e conformità (UE e Italia)** | Cosa prevede la legge e cosa fare prima della produzione                                                                                                    | Chi pubblica l'app    |
| **Stato del frontend e miglioramenti** | Cosa è già fatto, cosa manca e cosa migliorare                                                                                                              | Sempre                |

## Contratto comune

Vale con **qualunque** flusso di autenticazione.

### Indirizzo

Il frontend chiama indirizzi che iniziano con `/` (`/auth/login`): `baseUrlInterceptor` ci mette davanti l'`apiUrl` dell'ambiente (`src/environments/`, vedi `sviluppo.md`).

| Ambiente | Come si avvia       | Indirizzo del backend                                 |
| -------- | ------------------- | ----------------------------------------------------- |
| Locale   | `npm start`         | `http://localhost:3000`                               |
| Dev      | `npm run start:dev` | `https://INSERIRE_URL_API_DEV` (da sostituire)        |
| Prod     | build di produzione | `https://INSERIRE_URL_API_PRODUZIONE` (da sostituire) |

Il frontend è su un altro indirizzo (`http://localhost:4200`, Vercel), quindi il backend deve abilitare **CORS** per quegli indirizzi. Le intestazioni personalizzate qui sotto fanno partire una richiesta preliminare `OPTIONS`: il backend deve rispondere con `Access-Control-Allow-Headers: Authorization, Content-Type, X-Timezone, X-Guest-Id`.

### Formato delle risposte

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

### Intestazioni che manda il frontend

Solo alle chiamate al backend, mai a siti di terzi.

| Intestazione    | Quando              | Valore                       | A cosa serve                                                                                                                       |
| --------------- | ------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `Authorization` | utente **iscritto** | `Bearer <token>`             | Il token ricevuto al login. Identifica l'utente: il backend lo verifica a ogni chiamata                                            |
| `X-Guest-Id`    | utente **ospite**   | UUID v4, es. `3f2c…`         | Identifica un ospite anonimo (vedi «Utente ospite»)                                                                                |
| `X-Timezone`    | sempre              | fuso IANA, es. `Europe/Rome` | Il fuso del browser: «oggi», l'inizio della settimana (la busta settimanale) e le date delle uscite dipendono dal fuso dell'utente |
| `Content-Type`  | con un body         | `application/json`           | Il body delle `POST`, `PUT`, `PATCH` è JSON                                                                                        |

### Dati inviati: body e query string

| Cosa                                                        | Dove                        | Metodi                        |
| ----------------------------------------------------------- | --------------------------- | ----------------------------- |
| Dati da creare o modificare (credenziali, campi di un form) | **body** JSON               | `POST`, `PUT`, `PATCH`        |
| Filtri, ordinamento, pagina di una lista                    | **query string**            | `GET`                         |
| Quale risorsa                                               | **percorso** (`/comics/42`) | tutti                         |
| Cancellare una risorsa                                      | **percorso**, senza body    | `DELETE` (`/me/bookmarks/42`) |

- I filtri passano da `qs`: un oggetto diventa `?genre=manga&page=2`; gli array e gli oggetti annidati usano le parentesi (`?genre[0]=manga&genre[1]=seinen`, `?filters[author]=Oda`).
- Una `DELETE` non ha body. Solo una cancellazione in blocco con un criterio usa la query string.

### Codici di errore

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

## Gestione dell'autenticazione

Ci sono **due flussi possibili**. Il frontend implementa oggi il **Flusso 1** (login con `POST /auth/login`); il **Flusso 2** richiede le modifiche descritte nella sua sezione. Le parti in «Valido per entrambi i flussi» (ruolo, ospite) non cambiano.

### Quale flusso scegliere

|                                    | **Flusso 1 — senza Firebase**                                | **Flusso 2 — con Firebase Authentication**                             |
| ---------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| Chi gestisce password e token      | **Il tuo backend**                                           | **Firebase**: il tuo backend si limita a verificare i token            |
| Accesso e registrazione            | `POST /auth/login` da scrivere (e la registrazione)          | Già pronti nella libreria di Firebase                                  |
| Accesso con Google e Facebook      | Da implementare tu (OAuth e verifica del token del provider) | Già pronto in Firebase                                                 |
| Verifica email e recupero password | Da costruire                                                 | Già pronti                                                             |
| Rinnovo del token                  | Da costruire (refresh token, versione 2)                     | Automatico                                                             |
| Lavoro nel backend                 | **Più**: password, token, limiti ai tentativi                | **Meno**: verifica del token e database                                |
| Lavoro nel frontend                | **Poco**: login e token già fatti; manca l'utente in memoria | **Medio**: libreria Firebase, login, interceptor del token             |
| Sicurezza di base                  | Dipende da come lo scrivi: più occasioni di errore           | Password e token gestiti da Firebase; il resto resta tuo               |
| Dove stanno i dati di accesso      | Nel tuo database, anche solo in Europa                       | Su Google, **regione non selezionabile** (trasferimento verso gli USA) |
| Dipendenza da un servizio esterno  | Nessuna                                                      | Sì (guasti, prezzi)                                                    |
| Costo                              | Solo il tuo hosting                                          | Piano gratuito ampio, poi a pagamento (verifica i prezzi attuali)      |
| Ospite                             | Uguale (`X-Guest-Id`)                                        | Uguale (`X-Guest-Id`)                                                  |

**Come scegliere**

- **Non conosci molto il backend, o vuoi partire presto e con meno rischi** → **Flusso 2**, con il primo giro «email e password più Google» e l'ospite. È la strada più sicura per chi parte da zero, perché le parti più delicate (password e token) non le scrivi tu.
- **Vuoi tenere tutto nel tuo backend, nessuna dipendenza esterna e i dati di accesso solo in Europa** → **Flusso 1**, usando le librerie del tuo framework per password, token e limiti.
- **La conformità UE è la priorità e vuoi un servizio pronto** → un servizio equivalente con regione europea (per esempio Supabase) segue lo schema del Flusso 2; vedi «Flusso 1 o Flusso 2 dal punto di vista legale».

Si può **cambiare idea dopo**: ruolo letto dal backend, ospite, intestazioni e codici di errore sono gli stessi. Cambiano solo il login e la verifica del token.

### Flusso 1 — Senza Firebase: il tuo backend emette i token

Un **token firmato a scadenza breve, il ruolo letto dal backend con `GET /me` e nessun refresh token** (la «versione 1»). Si fa con poche chiamate e con librerie già pronte, e non richiede di scrivere crittografia a mano.

**Perché questo flusso**

| Qualità    | Come la ottiene                                                                                                        |
| ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| Veloce     | Una sola chiamata di accesso (`POST /auth/login`) più `GET /me`: due endpoint per tutta l'autenticazione               |
| Sicuro     | Password con hash, token firmato e a scadenza, ruolo deciso solo dal backend, limite ai tentativi, HTTPS, CORS preciso |
| Semplice   | Niente refresh token, niente cookie, niente stato da tenere sul server: il token firmato si verifica da solo           |
| Evolvibile | Il frontend non cambia per passare dopo a refresh token o cookie `httpOnly` (versioni 2 e 3)                           |

#### Come funziona, passo per passo

1. L'utente scrive email e password → il frontend chiama **`POST /auth/login`** (credenziali nel body).
2. Il backend controlla la password (confronta gli hash) e risponde con l'utente e un **token** firmato che scade dopo **8 ore**.
3. Il frontend tiene l'utente **solo in memoria** e il token nello `localStorage`. Da qui in poi ogni chiamata porta `Authorization: Bearer <token>`.
4. Se l'utente **ricarica la pagina**, il frontend vede il token e chiama **`GET /me`** per riavere l'utente (e il ruolo) in memoria. Il ruolo non sta mai nello storage.
5. Quando il token **scade**, il backend risponde `401`: il frontend toglie il token, porta al login e mostra «Sessione scaduta».
6. Se l'utente **esce**, il frontend cancella token e utente. Nella versione 1 il token resta valido sul server fino alla scadenza: è il compromesso che si accetta per tenere tutto semplice.
7. Un **ospite** non ha token: manda `X-Guest-Id` e può solo guardare.

#### Cosa fa il backend (in quest'ordine)

Usa le **librerie del tuo framework** per password, token e limiti: sono già scritte e provate, farle a mano è il modo più comune di introdurre falle.

1. **HTTPS**. I servizi di hosting più comuni (Render, Railway, Fly.io, Vercel) lo danno già: verifica che l'indirizzo cominci con `https://`.
2. **Password con hash**: salva solo l'hash con una libreria (bcrypt o Argon2). Mai la password in chiaro, nemmeno nei log.
3. **`POST /auth/login`**: trova l'utente, confronta la password con l'hash, crea il token. Se sbagliata risponde `401` con `INVALID_CREDENTIALS`, **uguale** per email inesistente e password errata. Aggiungi un **limite ai tentativi** con una libreria di rate limiting (es. 5 al minuto per IP) e rispondi `429` oltre.
4. **Token (JWT) con una libreria**: dentro metti solo `sub` (id utente), `role` e `exp` (scadenza tra **8 ore**). Il **segreto di firma** è una stringa lunga e casuale in una variabile d'ambiente, mai nel repository.
5. **Un controllo (middleware) sulle rotte protette**: verifica firma e scadenza del token e risponde `401` se non vanno. Si scrive una volta e si applica alle rotte.
6. **`GET /me`**: restituisce `id`, `email`, `userRole` dell'utente del token, leggendoli dal **database** (mai da dati mandati dal client).
7. **Controllo del ruolo** sulle rotte riservate agli admin: se non basta, `403` con `FORBIDDEN`. Il frontend nasconde le pagine, ma chi protegge davvero sei tu.
8. **CORS**: consenti solo gli indirizzi del frontend (locale, dev e produzione), non `*`.
9. **Formato delle risposte e codici di errore** come in «Formato delle risposte» e «Codici di errore».
10. **Ospite**: accetta `X-Guest-Id` solo se è un UUID valido, non dargli permessi da iscritto e rifiuta le sue scritture nelle liste (`401`/`403`).

#### Il login: `POST /auth/login`

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

#### Token scaduto o non valido

Quando il token non vale più il backend risponde **401** a una chiamata con `Authorization`. Il frontend allora fa uscire l'utente (toglie il token e porta al login) e mostra «Sessione scaduta». Se la risposta ha già un `code` (`SESSION_EXPIRED` o `UNAUTHORIZED`) il frontend lo tiene; se non ce l'ha, usa `SESSION_EXPIRED`. Un 401 a un ospite non fa uscire nessuno.

Per ora non c'è un rinnovo del token (refresh token): alla scadenza l'utente rifà il login.

#### Dove si conserva il token: raccomandazione

Oggi il frontend tiene il token nello `localStorage` del browser (`komixy.token`). Un `localStorage` si può leggere da qualunque script che gira nella pagina: se il sito avesse una falla che permette di far girare uno script estraneo (attacco XSS), il token potrebbe essere rubato e usato altrove fino alla scadenza. Il token in sé non si può falsificare (lo firma il backend): il rischio è solo che venga copiato.

**Raccomandazione**

1. **Ora: `localStorage` con `Authorization: Bearer`.** È già implementato e il rischio è basso (nessun pagamento, dati poco sensibili). In cambio il backend emette un **token a scadenza breve** (8 ore nella versione 1): un token rubato smette presto di valere. Alla scadenza risponde 401 e il frontend fa uscire l'utente.
2. **Prima della produzione con utenti veri: cookie `httpOnly`.** Il backend imposta il token in un cookie `httpOnly; Secure; SameSite=Lax` al login: il JavaScript della pagina non può leggerlo, quindi non si può rubare. Funziona bene solo se frontend e backend stanno sullo **stesso sito**: un dominio proprio (`komixy.it` e `api.komixy.it`) oppure il backend raggiunto da un rewrite di Vercel (`/api/*`). Con siti diversi il cookie è «di terze parti» e i browser lo bloccano.

**Cosa cambierebbe con il cookie**

| Chi      | Cosa                                                                                                                                                                                                                                                                                                                                                                       |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend  | Al login imposta il cookie `httpOnly; Secure; SameSite=Lax` e **non** restituisce più `token` nel body; riconosce l'utente dal cookie; abilita CORS con credenziali (`Access-Control-Allow-Credentials: true`, origine esplicita, non `*`); protegge le scritture da CSRF (per esempio con un'intestazione che il browser non manda da solo); un logout cancella il cookie |
| Frontend | Toglie `bearerTokenInterceptor` e la chiave `komixy.token`, manda le chiamate con `withCredentials`; il `tokenExpiredInterceptor` e `X-Guest-Id` restano uguali                                                                                                                                                                                                            |

Nel codice è un `TODO(api)` (`form.const.ts`).

#### Sessione lunga: refresh token (versione 2)

Con un token di accesso breve, l'utente rientrerebbe ogni ora. Per evitarlo:

1. Il login restituisce anche un **refresh token** lungo (giorni o settimane), casuale, salvato nel database **come hash**.
2. `POST /auth/refresh` lo scambia con un nuovo token di accesso **e con un nuovo refresh token** (rotazione): il vecchio non vale più.
3. **Rilevamento del riuso**: se arriva un refresh token già usato, qualcuno l'ha copiato; il backend chiude tutta la famiglia di sessioni di quell'utente.
4. `POST /auth/logout` invalida il refresh token; anche un cambio password invalida tutte le sessioni.
5. Il refresh token ideale sta in un cookie `httpOnly` limitato a `/auth/refresh`, così nessuno script lo legge.

#### Cosa fa il frontend (stato)

| Passo                                                                    | Stato       | Note                                                                                              |
| ------------------------------------------------------------------------ | ----------- | ------------------------------------------------------------------------------------------------- |
| Login con credenziali nel body, token ricevuto e conservato              | **fatto**   | `AuthService`, `SessionService`                                                                   |
| `Authorization: Bearer` su ogni chiamata dell'iscritto                   | **fatto**   | `bearerTokenInterceptor`                                                                          |
| Identificativo dell'ospite (`X-Guest-Id`)                                | **fatto**   | `guestIdInterceptor`                                                                              |
| Fuso orario (`X-Timezone`)                                               | **fatto**   | `timezoneInterceptor`                                                                             |
| 401 → uscita e «Sessione scaduta»                                        | **fatto**   | `tokenExpiredInterceptor`                                                                         |
| Messaggi d'errore dal codice del backend                                 | **fatto**   | `ApiErrorService`                                                                                 |
| Indirizzo del backend per locale, dev e produzione                       | **fatto**   | `src/environments/`; da sostituire i segnaposto `INSERIRE_URL_...`                                |
| Utente e ruolo **solo in memoria**, `GET /me` all'avvio, guard asincrono | **da fare** | Oggi l'utente è ancora nello `localStorage` (`komixy.user`): vedi «Il ruolo e i dati dell'utente» |
| La preview di Vercel con l'ambiente di dev                               | **da fare** | Oggi usa quello di produzione                                                                     |
| CSP su Vercel (prima in sola segnalazione)                               | **da fare** | Seconda difesa contro gli script estranei                                                         |

Il frontend si può completare quando il backend ha `POST /auth/login` e `GET /me`: la parte «da fare» più importante è quella sull'utente in memoria.

#### Le versioni del Flusso 1

| Versione       | Cosa si aggiunge                                                                                                                                                     | Quando                      |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| **1** (questa) | Token a 8 ore, `GET /me`, ruolo letto dal server                                                                                                                     | Per partire                 |
| **2**          | **Refresh token** con rotazione e `POST /auth/logout`: il token di accesso scende a 15–60 minuti, l'utente non rifà il login e l'uscita invalida davvero la sessione | Prima di avere molti utenti |
| **3**          | **Cookie `httpOnly`** al posto dello `localStorage` (serve lo stesso sito per frontend e backend)                                                                    | Con un dominio proprio      |

### Flusso 2 — Con Firebase Authentication collegato al tuo backend

Stato: **non ancora implementato nel frontend**; è l'alternativa al Flusso 1, pensata per chi non vuole scrivere da sé password, token e accesso con Google e Facebook. Le indicazioni sui prodotti esterni vanno verificate nella documentazione ufficiale di Firebase, che può cambiare.

**Primo giro: email e password più Google, più la modalità ospite.** Facebook è un passo successivo (la sua configurazione è già descritta, ma non serve per partire). Apple non è previsto.

#### Come sono collegati i pezzi

```
 Browser (Angular)                 Firebase Authentication                 Il tuo backend
 ───────────────                  ───────────────────────                 ──────────────
 1. login (email, Google, Facebook) ─────────────►  verifica l'utente
 2.                              ◄─────────────  token (ID token, scade in ~1 ora)
 3. ogni chiamata: Authorization: Bearer <token> ────────────────────────────────►
 4.                                              ◄── chiavi pubbliche ───  verifica la firma del token
 5.                                                                         legge/crea l'utente nel tuo database
 6.                              ◄──────────────────────────────────────────── risposta (busta ApiResponse)
```

- **Firebase** sa _chi è_ l'utente (password, Google, Facebook, verifica email, recupero password). Il tuo backend non vede mai la password.
- **Il tuo backend** sa _cosa può fare_ l'utente e tiene i dati dell'app (libreria, segnalibri, busta). Ricava l'utente dal token e lega i suoi dati all'**`uid`** di Firebase.
- Il token lo rinnova da solo la libreria di Firebase nel browser (dura circa un'ora): il frontend non gestisce il rinnovo.

#### Cosa fa il backend (in quest'ordine)

1. **Crea il progetto Firebase** (console Firebase) e annota l'**ID del progetto**. In _Authentication → Sign-in method_ attiva _Email/Password_ e _Google_ (Facebook dopo, quando serve: vedi «Cosa configurare: Google e, dopo, Facebook»).
2. **Autorizza i domini del frontend**: in _Authentication → Settings → Authorized domains_ aggiungi `localhost`, il dominio di dev e quello di produzione, altrimenti Google e Facebook non funzionano.
3. **Installa l'Admin SDK di Firebase** nel backend (disponibile per Node.js, Python, Java, Go e C#; per altri linguaggi si verifica il token con una libreria JWT, seguendo la guida ufficiale). Serve la **chiave dell'account di servizio** (un file JSON scaricabile dalla console): è **un segreto** e va solo nelle variabili d'ambiente del server, mai nel repository né nel frontend (segnaposto: `INSERIRE_CHIAVE_PRIVATA`).
4. **Un controllo (middleware) su ogni rotta protetta**: legge `Authorization: Bearer <token>` e lo verifica con l'Admin SDK (`verifyIdToken`). Se non vale, `401` (con `UNAUTHORIZED`, o `SESSION_EXPIRED` se è scaduto). Se vale, ottieni `uid` ed `email` dell'utente.
5. **`GET /me`**: cerca l'utente nel **tuo** database con `uid`; se non c'è lo **crea al volo** (ruolo `1` = utente) e risponde con `id`, `email`, `userRole` nella busta. Così non serve un passaggio di registrazione separato lato backend.
6. **Controllo del ruolo** sulle rotte admin: il ruolo si legge dal tuo database (o da un custom claim, vedi sotto) e mai dal client; se non basta `403` con `FORBIDDEN`.
7. **Non scrivere** `POST /auth/login`, l'hash delle password né l'emissione dei token: li fa Firebase. Resta tutto il resto (CORS con elenco preciso, busta `ApiResponse`, codici di errore, ospite).
8. **Eliminare un utente** (richiesta o privacy): cancellalo in Firebase _e_ nel tuo database.

#### Collegare Firebase al tuo database

Firebase tiene **l'identità** (chi è, come entra, la password). Il tuo database tiene **i dati dell'app** (ruolo, libreria, segnalibri, busta). Il legame è l'**`uid`**: un identificativo che Firebase dà a ogni utente e che **non cambia** mai, nemmeno se l'utente collega un altro metodo di accesso.

**1. Le tabelle** (esempio SQL; adattalo al tuo database)

```sql
CREATE TABLE users (
  id            VARCHAR(128) PRIMARY KEY,      -- l'uid di Firebase
  email         VARCHAR(320),                  -- può mancare (es. Facebook)
  display_name  VARCHAR(255),
  role          SMALLINT NOT NULL DEFAULT 1,   -- 0 = admin, 1 = utente
  created_at    TIMESTAMP NOT NULL DEFAULT now(),
  last_login_at TIMESTAMP
);

CREATE TABLE bookmarks (
  user_id   VARCHAR(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comic_id  VARCHAR(64)  NOT NULL,
  PRIMARY KEY (user_id, comic_id)
);
```

- **Nessuna colonna per la password**: non la vede e non la salva il tuo backend.
- Le altre tabelle puntano a `users.id` (`user_id`), non all'email.

**2. Cosa fa il backend a ogni chiamata protetta** (esempio in JavaScript, da adattare al tuo linguaggio)

```js
async function requireAuth(req, res, next) {
  const token = (req.headers.authorization ?? '').replace('Bearer ', '');

  let decoded;
  try {
    decoded = await admin.auth().verifyIdToken(token); // firma, scadenza, progetto
  } catch {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Token non valido' },
      result: null,
    });
  }

  // Il database va fuori dal try: un suo errore non è un 401
  let user = await db.findUserById(decoded.uid);
  if (!user) {
    user = await db.createUser({ id: decoded.uid, email: decoded.email ?? null, role: 1 });
  }
  req.user = user; // da qui in poi si usa req.user.id e req.user.role
  next();
}
```

1. Si legge il token e si verifica con Firebase: se non vale, `401`.
2. Si cerca l'utente nel tuo database con l'`uid`. **Se è la prima volta lo si crea** con ruolo `1`: così non serve un passaggio di registrazione separato.
3. Le rotte lavorano con `req.user`: i dati si leggono e si scrivono sempre con `req.user.id`, **mai con un id mandato dal frontend**.
4. `GET /me` restituisce `req.user` (`id`, `email`, `userRole`).

**3. Il ruolo di admin**: si cambia dal database (`UPDATE users SET role = 0 WHERE id = '<uid>'`), a mano o con uno script. Vale subito.

**4. Dati dell'ospite**: con Firebase il login avviene direttamente su Firebase, quindi il backend non vede `X-Guest-Id` durante l'accesso. Appena dopo il login il frontend chiama una volta **`POST /me/claim-guest`** con nel body `{ "guestId": "<uuid>" }`. Il backend sposta sull'`uid` i dati creati da quell'ospite (per esempio l'apertura della busta della settimana), senza sovrascrivere quelli già presenti. La chiamata deve essere **ripetibile senza danni** e un identificativo ospite si può riscattare **una sola volta**.

**5. Eliminare un utente** (`DELETE /me`): il backend cancella i dati dell'utente dal tuo database (in una transazione) e poi l'utente su Firebase (`admin.auth().deleteUser(uid)`). Se il secondo passo fallisce si ripete.

**6. Se hai già utenti con password nel tuo database**: Firebase permette di **importarli con le loro password cifrate** (comando `firebase auth:import`, con gli algoritmi supportati; controlla la guida) e di scegliere l'`uid`, così gli identificativi che hai già restano gli stessi. Altrimenti aggiungi una colonna `firebase_uid` e collega l'utente al primo accesso **solo se l'email è verificata** (`email_verified`): collegare per email non verificata permette di rubare un account.

**Cosa non fare**

- Dare al frontend l'accesso o le credenziali del database: parla solo il tuo backend.
- Usare l'email come chiave: può cambiare o mancare.
- Fidarsi di un `userId` o di un ruolo mandati dal frontend.
- Saltare `verifyIdToken` o decodificare il token senza verificarne la firma.
- Mettere la chiave dell'account di servizio di Firebase nel repository.

#### Il ruolo: database o custom claim

Due modi, a scelta:

| Modo                               | Come                                                                                                    | Pro                                           | Contro                                                                                            |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Dal tuo database** (consigliato) | Colonna `role` nella tabella utenti, letta da `GET /me` e dai controlli                                 | Un cambio vale subito, una sola fonte         | Una lettura al database                                                                           |
| **Custom claim**                   | Il backend imposta `role` con `setCustomUserClaims(uid, { role: 1 })` e il ruolo arriva dentro il token | Il frontend lo legge dal token senza chiamate | Vale dal token successivo (fino a un'ora, o forzando un nuovo token) e ha un limite di dimensione |

#### Cosa configurare: Google e, dopo, Facebook

**Google** (primo giro, il più semplice)

1. In _Authentication → Sign-in method_ attiva _Google_ e imposta il nome pubblico del progetto e l'email di assistenza.
2. Controlla che i domini del frontend siano in _Authorized domains_ (vedi sopra).
3. Per i dati di base (nome ed email) Google non chiede nessuna verifica dell'app.

**Facebook** (da fare dopo, quando il primo giro funziona)

1. Su _Meta for Developers_ (developers.facebook.com) crea un'app e aggiungi il prodotto **Facebook Login**. Copia **ID app** e **Chiave segreta dell'app**.
2. In Firebase, _Authentication → Sign-in method → Facebook_: incolla ID app e chiave segreta. **La chiave segreta va solo nella console Firebase**: mai nel frontend né nel repository (segnaposto: `INSERIRE_CHIAVE_PRIVATA`).
3. Firebase mostra un **indirizzo di reindirizzamento** (`https://<progetto>.firebaseapp.com/__/auth/handler`): copialo in Meta, in _Facebook Login → Impostazioni → URI di reindirizzamento OAuth validi_.
4. Nelle impostazioni base dell'app Meta compila l'**indirizzo dell'informativa sulla privacy**, l'icona e la categoria, e indica come un utente può chiedere la **cancellazione dei dati** (Meta lo richiede per un'app pubblica).
5. Porta l'app Meta in modalità **Live**: finché è in sviluppo possono accedere solo gli utenti con un ruolo nell'app.
6. I permessi `public_profile` ed `email` bastano e non richiedono la revisione di Meta; permessi in più sì.

Due cose da sapere con Facebook:

- **L'email può mancare** (un utente può essersi iscritto con il telefono o non aver concesso il permesso): la colonna `email` del tuo database deve accettare valori vuoti, e l'email non è la chiave dell'utente.
- **Lo stesso utente con due metodi.** Firebase, di base, consente **un solo account per email**: se uno si è iscritto con Google e poi prova Facebook con la stessa email, il frontend riceve `auth/account-exists-with-different-credential`. Si risponde dicendogli di accedere con il primo metodo; poi l'app può collegare il secondo (`linkWithPopup`), e l'`uid` non cambia. Non attivare «più account per email»: creerebbe due utenti diversi per la stessa persona.

#### Cosa fa il frontend

| Parte                             | Cosa cambia                                                                                                                                                                                                                                                                                                     |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Libreria                          | Si aggiunge `@angular/fire` (o l'SDK `firebase`), con `provideFirebaseApp` e `provideAuth`                                                                                                                                                                                                                      |
| Configurazione                    | Un campo `firebase` in `Environment` (`apiKey`, `authDomain`, `projectId`, `appId`) in ognuno dei tre file di `src/environments/`, con segnaposto `INSERIRE_...`. **Questi valori sono pubblici** (identificano il progetto, non lo proteggono), a differenza della chiave dell'account di servizio del backend |
| Login con email                   | `AuthService.authenticate()` usa `signInWithEmailAndPassword` al posto di `POST /auth/login`                                                                                                                                                                                                                    |
| Google (primo giro)               | Il pulsante Google del login (oggi simulato) usa `signInWithPopup` con `GoogleAuthProvider`. Il pulsante **Apple** va tolto dal login: per ora resta solo Google                                                                                                                                                |
| Facebook (dopo)                   | Un pulsante in più con `FacebookAuthProvider` (icona e testi tradotti), quando si decide di aggiungerlo                                                                                                                                                                                                         |
| Registrazione e recupero password | Le due pagine segnaposto usano `createUserWithEmailAndPassword` e `sendPasswordResetEmail`; la verifica email con `sendEmailVerification`                                                                                                                                                                       |
| Token nelle chiamate              | `bearerTokenInterceptor` chiede il token alla libreria (`user.getIdToken()`, che lo rinnova se serve) invece di leggerlo da `SessionService`; diventa asincrono                                                                                                                                                 |
| Sessione scaduta                  | Il rinnovo lo fa Firebase; un `401` dal backend resta il segnale per uscire (`signOut`) e portare al login                                                                                                                                                                                                      |
| Utente e ruolo                    | Restano **solo in memoria**; all'avvio si chiama `GET /me` (come nel Flusso 1)                                                                                                                                                                                                                                  |
| Errori                            | Un piccolo traduttore converte gli errori di Firebase in `ApiErrorResponse`, così `ApiErrorService` e i messaggi tradotti restano gli stessi                                                                                                                                                                    |
| Ospite                            | Resta `X-Guest-Id` (nessun cambiamento); in alternativa l'accesso anonimo di Firebase (`signInAnonymously`), che dà un `uid` all'ospite e lo trasforma in utente vero quando si registra, senza dover trasferire dati. È una scelta da fare dopo                                                                |
| Test                              | I test dell'autenticazione usano un finto Firebase; gli interceptor restano come sono, tranne quello del token                                                                                                                                                                                                  |

Codici di errore di Firebase da convertire nei nostri:

| Firebase                                                                | Nostro `code`                                                                                                                                                                                    |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `auth/invalid-credential`, `auth/wrong-password`, `auth/user-not-found` | `INVALID_CREDENTIALS`                                                                                                                                                                            |
| `auth/email-already-in-use`                                             | `EMAIL_ALREADY_EXISTS`                                                                                                                                                                           |
| `auth/too-many-requests`                                                | `TOO_MANY_REQUESTS`                                                                                                                                                                              |
| `auth/account-exists-with-different-credential`                         | codice nuovo `ACCOUNT_EXISTS_WITH_OTHER_PROVIDER` (da aggiungere a `API_ERROR_MESSAGES`, con le traduzioni): «Esiste già un account con questa email, accedi con il metodo usato la prima volta» |
| `auth/popup-closed-by-user`, `auth/cancelled-popup-request`             | nessun messaggio: l'utente ha chiuso la finestra                                                                                                                                                 |
| `auth/network-request-failed` e simili                                  | nessun codice: compare il messaggio di default                                                                                                                                                   |

#### Sicurezza e limiti di Firebase

- Il token di Firebase è un JWT firmato da Google: il backend lo verifica con le chiavi pubbliche, e un token falso o scaduto non passa.
- Il browser conserva la sessione (di norma in IndexedDB): come per lo `localStorage`, uno script estraneo (attacco XSS) potrebbe leggerla. Valgono le stesse difese: CSP, pochi script di terzi e il ruolo sempre verificato dal backend.
- Per uscire davvero il backend può revocare i token con `revokeRefreshTokens(uid)` e controllare la revoca con `verifyIdToken(token, true)`.
- Nella console Google Cloud si può **limitare la chiave API web ai domini del sito**.
- **Privacy**: i dati di accesso degli utenti stanno su Google; Firebase Authentication non permette di scegliere la regione come altri servizi. Se il vincolo è tenere i dati in Europa, Supabase (con progetto in regione europea) è più adatto.
- **Costi**: c'è un piano gratuito ampio per cominciare; controlla i prezzi attuali prima di crescere, e che alcune funzioni (per esempio l'accesso con telefono) sono a pagamento.
- Si dipende da un servizio esterno: se Firebase ha un guasto, nessuno può accedere.

### Valido per entrambi i flussi

#### Il ruolo e i dati dell'utente: non si salvano nello storage

**Regola: il ruolo (`userRole`) e gli altri dati dell'utente (id, email) non si conservano nello storage del browser.** Nello storage resta solo il necessario per riconoscere la sessione (il token e, per l'ospite, il suo identificativo). Il motivo: ciò che sta nello storage lo può leggere e **modificare** chiunque apra gli strumenti del browser. Se il frontend si fidasse di un `userRole` salvato lì, un utente potrebbe darsi da solo il ruolo di admin e vedere le pagine riservate.

**Come deve comportarsi il frontend**

1. **Al login** il backend risponde con l'utente (`id`, `email`, `userRole`) e con il `token`. Il frontend tiene l'utente **solo in memoria** (un signal) e il token come descritto in «Dove si conserva il token». L'utente non viene scritto altrove.
2. **Ricaricando la pagina** (F5, riapertura del sito) la memoria si svuota. Se esiste un token, il frontend chiama **`GET /me`**, che restituisce l'utente corrente, e lo rimette in memoria. Finché la risposta non arriva l'app mostra il caricamento e le pagine riservate aspettano.
3. **Se `GET /me` risponde 401** (token scaduto o non valido) il frontend toglie il token e porta al login, come per qualunque altra chiamata.
4. **Il ruolo serve solo all'interfaccia**: mostrare o nascondere una voce di menu, decidere se una pagina si apre. È una comodità. Anche se l'utente riuscisse a cambiarlo in memoria, il backend rifiuta comunque ogni chiamata riservata.
5. **All'uscita** (logout o sessione scaduta) l'utente in memoria e il token vengono cancellati.

**Come deve comportarsi il backend**

1. **`GET /me`** (richiede `Authorization`) restituisce l'utente nella solita busta:

```json
{
  "error": { "code": "", "message": "" },
  "result": { "id": "1", "email": "demo@example.com", "userRole": 1 }
}
```

2. Il **ruolo si legge sempre lato server**, dal database o dal token firmato, mai da un dato mandato dal client. Un cambio di ruolo fatto dal database vale al successivo `GET /me`, senza che l'utente rifaccia il login.
3. **Ogni endpoint riservato controlla il ruolo** (`403` con `FORBIDDEN` se non basta) e che i dati siano dell'utente del token (`/me/...`).
4. In alternativa a `GET /me` il ruolo può stare come **claim nel JWT** (`role`) e il frontend leggerlo dal token in memoria: funziona, ma un cambio di ruolo vale solo dal token successivo. Si consiglia `GET /me`, perché il backend resta l'unica fonte.

**Stato attuale del frontend (da cambiare)**

Oggi `AuthService` salva l'utente completo, ruolo compreso, nello `localStorage` (`komixy.user`) e lo rilegge all'avvio, e `userRoleGuard` si fida di quel valore. Per rispettare la regola serve:

- togliere la scrittura e la lettura di `komixy.user` in `AuthService` e cancellare la chiave vecchia se esiste;
- all'avvio, se c'è un token, chiamare `GET /me` e riempire l'utente in memoria;
- rendere asincrono `userRoleGuard`: deve aspettare che l'utente sia caricato prima di decidere;
- valutare se il flag `komixy.session` (iscritto sì o no) serve ancora: l'iscritto si può riconoscere dalla presenza del token.

#### Utente ospite

Chi entra con «Entra come ospite» (o non ha fatto il login) non ha un account: può guardare la classifica, aprire la busta e vedere i dettagli, ma **non può salvare** nelle liste. L'ospite **non usa Firebase** e non ha un token: il frontend gli dà un identificativo anonimo.

- è un **UUID v4** creato dal browser la prima volta e conservato (`komixy.guestId` nello `localStorage`); resta lo stesso finché l'utente non cancella i dati del browser, anche dopo un login e un'uscita;
- si manda in **`X-Guest-Id`** a ogni chiamata dell'ospite, **al posto** del token;
- non è un segreto né una prova di identità: serve solo a contare e ritrovare dati anonimi. Non vale come autenticazione.

Questo comportamento è **già implementato nel frontend** e uguale in entrambi i flussi.

**Cosa deve fare il backend con un ospite**

Cosa deve fare il backend con un ospite:

| Cosa                                            | Comportamento atteso                                                                                                                                                                       |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Letture pubbliche (classifica, dettagli, busta) | Rispondere normalmente, anche senza `Authorization`                                                                                                                                        |
| **Busta settimanale**                           | Registrare **una apertura per settimana ISO** per `user_id` (iscritto) o `guest_id` (ospite), nel fuso di `X-Timezone`. Oggi il frontend la ricorda solo nel browser (`komixy.weeklyPack`) |
| Scritture nelle liste (segnalibri, libreria)    | Rifiutare un ospite con **401** (`UNAUTHORIZED`) o **403** (`FORBIDDEN`). Il frontend non offre già il comando, ma il backend deve comunque difendersi                                     |

**Il percorso, passo per passo**

1. **Prima visita**: il frontend crea l'UUID e da quel momento ogni chiamata al backend porta `X-Guest-Id`, senza `Authorization`. Chi sceglie «Entra come ospite» nel login entra così, senza account.
2. **Cosa può fare**: guardare la classifica e i dettagli e aprire la busta della settimana. **Non può salvare** nelle liste: il frontend non offre il comando (invita a iscriversi) e il backend rifiuta comunque le scritture con `401` (`UNAUTHORIZED`).
3. **La busta**: il backend registra **una apertura per settimana ISO** per quel `guest_id`, nel fuso di `X-Timezone`. Un ospite che cancella i dati del browser ottiene un nuovo identificativo e può riaprire: è un limite accettato, la busta non è un dato critico.
4. **Registrazione o login**: l'ospite diventa iscritto e i suoi dati si trasferiscono sull'account, in modo diverso secondo il flusso:
   - **Flusso 1**: la chiamata `POST /auth/login` porta ancora `X-Guest-Id` (l'utente è ancora un ospite) e il backend sposta i dati di quell'ospite **nella risposta del login riuscito**.
   - **Flusso 2**: il login avviene su Firebase e il backend non lo vede. **Subito dopo** il frontend chiama una volta `POST /me/claim-guest` con `{ "guestId": "<uuid>" }`.

   In entrambi i casi si spostano solo i dati creati da quell'ospite (per esempio l'apertura della busta), senza sovrascrivere quelli già presenti, e l'identificativo si segna come riscattato. Da qui in poi le chiamate portano `Authorization` e non più `X-Guest-Id`.

5. **Uscita**: l'utente torna ospite con lo **stesso** identificativo. Un identificativo già riscattato non va riscattato di nuovo da un altro utente (restituire `409` o ignorarlo).

**Cosa deve fare il backend con `X-Guest-Id`**

| Regola                                                                                                       | Perché                                                               |
| ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Accettarlo solo se è un **UUID valido**; altrimenti lo si ignora (l'utente è un ospite senza identificativo) | Il valore lo sceglie il browser e va trattato come dato non fidato   |
| **Nessun permesso da iscritto**, nessun dato personale mostrato in base solo all'identificativo              | Non è una prova di identità: chi lo conosce lo può usare             |
| **Limite di richieste** per identificativo e per IP                                                          | Un ospite può cambiare identificativo cancellando i dati del browser |
| Riscattare un identificativo **una sola volta**, e solo per dati creati da quell'ospite                      | Impedisce che un altro utente si porti via i dati                    |
| **Eliminare i dati degli ospiti inattivi** dopo un certo tempo (per esempio 90 giorni)                       | Dati anonimi che non servono più e riducono i rischi di privacy      |

**Privacy**: un identificativo conservato nel browser serve a riconoscere un visitatore, quindi va citato nell'informativa sulla privacy e, secondo le regole locali sui dati conservati nel dispositivo (ePrivacy/GDPR), può richiedere il consenso. È un punto da verificare prima di andare in produzione.

**Stato nel frontend**

| Parte                                                                  | Stato                                                                            |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Identificativo creato e conservato (`SessionService.guestId`)          | **fatto**                                                                        |
| `X-Guest-Id` nelle chiamate dell'ospite (`guestIdInterceptor`)         | **fatto**                                                                        |
| L'ospite non può salvare (`BookmarksService`, avviso nelle pagine)     | **fatto**                                                                        |
| Trasferimento dei dati al login, **Flusso 1**                          | Nessuna modifica al frontend: l'intestazione viaggia già nella chiamata di login |
| Trasferimento dei dati al login, **Flusso 2** (`POST /me/claim-guest`) | **da fare**, insieme all'integrazione di Firebase                                |

**Alternativa più avanti: accesso anonimo di Firebase** (`signInAnonymously`). L'ospite ottiene un `uid` e un token veri e, quando si registra, i suoi dati restano agli stessi `uid` senza dover riscattare nulla. Costa un po' di complessità (account anonimi da pulire, l'ospite diventa un utente con token) e non serve per partire.

## Sicurezza del backend

Il frontend gira nel browser dell'utente e chiunque può modificarlo: **ogni controllo di sicurezza deve essere rifatto dal backend**. Ciò che fa il frontend (validare i campi, nascondere un bottone, bloccare una pagina con un guard) serve solo all'esperienza dell'utente, non protegge niente.

> Con il **Flusso 2** le parti «Accesso e password» e «Il token di accesso» le gestisce Firebase: restano valide tutte le altre. Con il **Flusso 1** valgono tutte.

### Accesso e password (Flusso 1)

1. **Solo HTTPS**, con l'intestazione `Strict-Transport-Security` (HSTS). Mai password o token su HTTP.
2. **Password**: salvate solo come hash con un algoritmo lento pensato per le password (Argon2id, oppure bcrypt), con sale. Mai in chiaro, mai nei log. Il frontend controlla solo una lunghezza minima di 6 caratteri: la regola vera (lunghezza, parole comuni) la applica il backend.
3. **Stesso errore per email e password sbagliate** (`INVALID_CREDENTIALS`): non rivelare se un'email esiste. Il tempo di risposta non deve cambiare tra i due casi.
4. **Limite ai tentativi**: massimo di login falliti per indirizzo IP e per email, poi `429` con `TOO_MANY_REQUESTS` (e un'attesa crescente).
5. Le risposte del login e dei dati personali portano `Cache-Control: no-store`.

### Il token di accesso (Flusso 1)

1. **JWT firmato** con un segreto lungo e casuale (o una coppia di chiavi RS256/ES256). Il segreto sta nelle variabili d'ambiente del server, mai nel repository.
2. **Contenuto minimo**: `sub` (id utente), `role`, `iat`, `exp`, `jti`. Niente password, email non necessarie o dati sensibili: un JWT si legge, non è cifrato.
3. **Scadenza breve**: **8 ore** nella versione 1 (senza refresh token); da 15 minuti a 1 ora quando c'è il refresh token (versione 2). È la difesa principale contro un token rubato.
4. **Verifica a ogni chiamata**: firma, scadenza e algoritmo (accettare solo quello atteso, mai `alg: none`). Se non vale, `401`.
5. **Il ruolo si legge dal token o dal database, mai dai dati del client.** Il frontend **non** lo salva nello storage (vedi «Il ruolo e i dati dell'utente»), ma resta comunque un'interfaccia che si può manipolare: `userRoleGuard` è solo una comodità, quindi ogni endpoint riservato agli admin deve controllare il ruolo lato server (`403 FORBIDDEN`).
6. **Controllo di proprietà**: `/me/...` lavora solo sui dati dell'utente del token. Mai fidarsi di un id utente passato dal client.

### CORS e intestazioni (entrambi i flussi)

1. **CORS con un elenco preciso di origini** (`http://localhost:4200`, il sito di dev, il sito pubblico). Mai `*` insieme alle credenziali.
2. Consentire solo i metodi e le intestazioni che servono (`Authorization`, `Content-Type`, `X-Timezone`, `X-Guest-Id`).
3. Sulle risposte dell'API: `X-Content-Type-Options: nosniff` e, se il token passa a un cookie, i flag `httpOnly; Secure; SameSite=Lax` più la protezione CSRF sulle scritture (vedi «Dove si conserva il token»).

### Dati ricevuti (entrambi i flussi)

1. **Validare tutto lato server**: tipo, lunghezza, formato (email, UUID). Dati non validi → `422` con `VALIDATION_ERROR`.
2. Query parametrizzate o ORM: mai concatenare i dati in una query SQL.
3. Mettere un limite alla dimensione del body e dei parametri di lista (pagina massima).

### Utente ospite (entrambi i flussi)

1. `X-Guest-Id` è scelto dal browser: **va trattato come un dato non fidato**. Controllare che sia un UUID valido, non dargli nessun permesso da iscritto e non mostrare dati personali sulla sola base di questo valore.
2. Applicare un limite alle richieste anche agli ospiti (per `guest_id` e per IP), perché un ospite può cambiare identificativo cancellando i dati del browser.
3. Il trasferimento dei dati dell'ospite sull'account (per esempio la busta già aperta) si fa **solo nella risposta di un login riuscito**, e solo per dati creati dall'ospite stesso.

### Log e gestione (entrambi i flussi)

1. Nei log mai password, token o refresh token (nemmeno parziali). Sì a eventi come login falliti, 401 anomali e riuso di un refresh token.
2. I segreti (chiave del JWT, password del database) stanno nelle variabili d'ambiente, non nel repository, e si cambiano se si sospetta una fuga.
3. Aggiornare le dipendenze e lanciare un controllo (`npm audit` o equivalente) a ogni rilascio.

## Endpoint

| Endpoint                                                                | Flusso                      | Stato      | Note                                                                                                                                 |
| ----------------------------------------------------------------------- | --------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `POST /auth/login`                                                      | 1                           | **in uso** | Descritto in «Il login: `POST /auth/login`»                                                                                          |
| `POST /auth/refresh`, `POST /auth/logout`                               | 1 (versione 2)              | previsto   | Rinnovo del token e uscita che invalida la sessione                                                                                  |
| `GET /me`                                                               | entrambi                    | previsto   | L'utente corrente (`id`, `email`, `userRole`): il frontend lo chiama all'avvio se c'è un token; vedi «Il ruolo e i dati dell'utente» |
| `POST /me/claim-guest`                                                  | 2                           | previsto   | Sposta sull'utente i dati creati dall'ospite (`guestId` nel body); si può riscattare una volta                                       |
| `DELETE /me`                                                            | entrambi                    | previsto   | Cancella i dati dell'utente (con il Flusso 2 anche l'utente su Firebase)                                                             |
| `GET /me/export`                                                        | entrambi                    | previsto   | Esporta i dati dell'utente (portabilità, vedi «Privacy e conformità (UE e Italia)»)                                                  |
| `PUT /me/bookmarks/:comicId`                                            | entrambi                    | previsto   | Salva un volume nella libreria dell'iscritto (`BookmarksService`)                                                                    |
| `DELETE /me/bookmarks/:comicId`                                         | entrambi                    | previsto   | Toglie un volume dalla libreria                                                                                                      |
| Apertura della busta settimanale                                        | entrambi                    | previsto   | Una per settimana ISO, per `user_id` o `guest_id` (`WeeklyPackService`)                                                              |
| Classifica della settimana, «Manga da scoprire», dettaglio di un volume | entrambi                    | previsto   | Dati oggi simulati nei servizi (`WeeklyRankingService`, `ComicCatalogService`)                                                       |
| Registrazione, accesso con Google e Facebook                            | 1: da scrivere; 2: Firebase | previsto   | La pagina di registrazione è un segnaposto; l'accesso social è simulato (`TODO(api)`)                                                |

Forma delle risposte e dei campi: da definire insieme al backend quando si collega ogni schermata. I modelli sono in `shared/models/` (`comic.model.ts`, `ranking-entry.model.ts`) e nei `models/` delle feature; i nomi seguono la convenzione `Request`, `Response`, `Filters`.

## Privacy e conformità (UE e Italia)

> Informazioni generali, **non consulenza legale**. Prima della produzione fai rivedere informativa, termini e trattamento dei dati da un avvocato o da un consulente privacy. Le norme e le sentenze citate possono cambiare: verifica la situazione attuale.

Si applicano il **GDPR** (regolamento UE 2016/679), il **Codice Privacy italiano** (D.Lgs. 196/2003, modificato dal D.Lgs. 101/2018) e le regole ePrivacy sui dati conservati nel dispositivo, con le linee guida del **Garante per la protezione dei dati personali**. Valgono anche per un'app gratuita e piccola, appena si trattano dati personali (email, identificativi, libreria, identificativo ospite) di persone in Europa.

### I ruoli

| Chi                                  | Ruolo                                                                | Cosa serve                                                                                                                 |
| ------------------------------------ | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Tu (chi pubblica l'app)              | **Titolare del trattamento**: rispondi verso gli utenti e il Garante | Informativa, base giuridica, risposta ai diritti, sicurezza                                                                |
| Google/Firebase, hosting, database   | **Responsabili del trattamento**                                     | Un accordo sul trattamento dei dati (DPA, art. 28): Google lo offre nei suoi termini standard e va accettato nella console |
| Google (o Meta) per l'accesso social | Anche titolari autonomi per il proprio servizio di login             | Citarli nell'informativa                                                                                                   |

### I rischi, dal più probabile

| #   | Rischio                                                                                                                                                                                                                                                                                                                                                                                     | Cosa fare                                                                                                                                                                                                                                                                                                                                  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **Informativa privacy mancante o incompleta** (art. 13): è l'inadempienza più comune                                                                                                                                                                                                                                                                                                        | Scrivere un'informativa che dica chi sei, quali dati raccogli (email, identificativo, ruolo, libreria, identificativo ospite), perché e con quale base giuridica, per quanto tempo li tieni, con chi li condividi (Google, hosting), se li trasferisci fuori dall'UE, come esercitare i diritti e come contattarti o rivolgersi al Garante |
| 2   | **L'identificativo dell'ospite nel browser** (`komixy.guestId`). Se serve solo al funzionamento del servizio (la busta settimanale) di solito non richiede il consenso, ma va dichiarato; se si usasse per statistiche o marketing servirebbe il consenso                                                                                                                                   | Dichiararlo nell'informativa; **non** aggiungere strumenti di tracciamento o analisi non necessari (per esempio Google Analytics) senza un banner di consenso                                                                                                                                                                              |
| 3   | **Trasferimento dei dati verso gli Stati Uniti** (Google). Oggi si regge sul Data Privacy Framework UE-USA (decisione di adeguatezza del 2023, confermata dal Tribunale dell'UE a settembre 2025), ma l'appello alla Corte di giustizia (causa C-703/25 P) è pendente. Se fosse annullato resterebbero le clausole contrattuali standard di Google, con una valutazione in più a tuo carico | Citare il trasferimento nell'informativa, accettare i termini di Google e seguire l'esito del giudizio. **Firebase Authentication non permette di scegliere la regione dei dati**                                                                                                                                                          |
| 4   | **Diritti degli utenti**: accesso, rettifica, cancellazione, portabilità, opposizione; risposta entro un mese                                                                                                                                                                                                                                                                               | `DELETE /me` (cancella i dati e l'utente), un modo per **esportare** i dati dell'utente (per esempio `GET /me/export`) e una casella di contatto                                                                                                                                                                                           |
| 5   | **Sicurezza e violazione dei dati** (art. 32 e 33): una violazione si **notifica al Garante entro 72 ore**, e agli utenti se il rischio è alto                                                                                                                                                                                                                                              | Tutta la sezione «Sicurezza del backend» di questo documento, più una procedura scritta su chi fa cosa in caso di violazione                                                                                                                                                                                                               |
| 6   | **Minori**: in Italia il consenso digitale vale **dai 14 anni** (art. 2-quinquies del Codice Privacy); sotto, per un servizio basato sul consenso serve quello dei genitori. Un'app di fumetti ha probabilmente un pubblico giovane                                                                                                                                                         | Indicare un'**età minima di 14 anni** nei termini, chiederla alla registrazione e decidere come verificarla in modo ragionevole                                                                                                                                                                                                            |
| 7   | **Registro dei trattamenti** (art. 30) e DPO. Per piccole realtà il registro spesso non è obbligatorio ma è consigliato; il DPO di solito non serve                                                                                                                                                                                                                                         | Tenere un registro semplice (dati, scopo, durata, responsabili)                                                                                                                                                                                                                                                                            |
| 8   | **Conservazione**: i dati non si tengono più del necessario                                                                                                                                                                                                                                                                                                                                 | Cancellare gli **ospiti inattivi** dopo un tempo stabilito (per esempio 90 giorni) e i log di accesso dopo un tempo breve                                                                                                                                                                                                                  |

### Le sanzioni

Fino a **10 milioni di euro o il 2% del fatturato** per le violazioni degli obblighi del titolare e del responsabile, e fino a **20 milioni o il 4%** per le violazioni di principi, basi giuridiche, diritti degli interessati e trasferimenti. Per una piccola realtà il Garante di solito parte da richieste e ammonimenti, ma le sanzioni esistono, e gli utenti possono chiedere anche un risarcimento (art. 82).

### Un rischio che non riguarda l'accesso: le copertine

Le copertine dei fumetti (`public/img/covers`) sono protette dal diritto d'autore. Prima della pubblicazione verifica con gli editori o usa fonti con licenza.

### Cosa fare prima della produzione

1. **Informativa privacy e termini di servizio**, in italiano e (se serve) in inglese.
2. **Accordi sul trattamento dati** con Google/Firebase e con l'hosting.
3. **Nessun tracciamento non necessario**; un banner di consenso solo se si aggiungono strumenti che lo richiedono.
4. **Cancellazione ed esportazione** dei dati dell'utente (`DELETE /me` e un'esportazione).
5. **Cancellazione automatica** degli ospiti inattivi e dei log vecchi.
6. **Procedura per le violazioni**, con l'avviso al Garante entro 72 ore.
7. **Età minima di 14 anni** nei termini e alla registrazione.
8. **Revisione di un consulente** su informativa, termini e trasferimenti.

### Flusso 1 o Flusso 2 dal punto di vista legale

| Scelta                                                    | Dati di accesso                          | Pro                                           | Contro                                                                          |
| --------------------------------------------------------- | ---------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------- |
| **Flusso 1** (senza Firebase) su backend e database in UE | Nel tuo database, in Europa              | Nessun trasferimento extra-UE da giustificare | Password e token sono tuoi (rischio di sicurezza, vedi «Sicurezza del backend») |
| **Flusso 2** (Firebase Authentication)                    | Su Google, **regione non selezionabile** | Meno rischio tecnico                          | Trasferimento verso gli Stati Uniti da dichiarare e seguire nel tempo           |
| **Supabase** con progetto in regione europea              | In Europa                                | Dati in UE e meno lavoro                      | Servizio esterno da gestire con il suo DPA                                      |

Se la conformità è la priorità, il Flusso 1 su hosting europeo o un servizio come Supabase in regione europea sono le scelte più semplici da giustificare. Con il Flusso 2 è gestibile, ma serve più documentazione.

## Stato del frontend e miglioramenti

### Cosa è stato fatto nel frontend

| Cosa                                | Dove                                                                      | Come funziona                                                                                                            |
| ----------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Indirizzo del backend per ambiente  | `src/environments/`, `baseUrlInterceptor`                                 | Locale, dev e produzione cambiano solo l'`apiUrl`; i servizi scrivono `/auth/login` e l'interceptor completa l'indirizzo |
| Token a ogni chiamata dell'iscritto | `bearerTokenInterceptor`, `SessionService`                                | `Authorization: Bearer <token>`, solo verso il backend; il token è in memoria e nello `localStorage`                     |
| Identificativo dell'ospite          | `guestIdInterceptor`, `SessionService`                                    | UUID creato dal browser, mandato in `X-Guest-Id` al posto del token                                                      |
| Fuso orario                         | `timezoneInterceptor`                                                     | `X-Timezone` con il fuso IANA del browser                                                                                |
| Sessione scaduta                    | `tokenExpiredInterceptor`, `AuthService.logout()`                         | Un 401 a un iscritto toglie il token, porta al login e mostra «Sessione scaduta» (`SESSION_EXPIRED`)                     |
| Errori delle chiamate               | `ApiErrorResponse`, `ApiErrorService`, `API_ERROR_MESSAGES`               | Ogni errore diventa uno stato e un `code`; il `code` sceglie il messaggio tradotto, altrimenti compare quello di default |
| Login                               | `LoginForm`, `AuthService.authenticate()`                                 | Credenziali nel body, `result` con utente e `token`; l'errore compare in un toast                                        |
| Ospite                              | `SessionService`, `BookmarksService`                                      | Può guardare ma non salvare nelle liste; il tasto avvisa con un messaggio                                                |
| Test                                | `core/interceptors/*`, `session.service.spec.ts`, `http.provider.spec.ts` | Ogni interceptor ha il suo spec, più il percorso completo login → token → `Authorization`                                |

Cosa il frontend **non** fa oggi (oltre a conservare ancora l'utente, ruolo compreso, nello storage: vedi «Il ruolo e i dati dell'utente»): non decodifica né controlla il token (lo manda e basta), non rinnova il token, non chiama il backend all'uscita e non ripete una chiamata fallita.

### Cosa si può migliorare o aggiungere

In ordine di importanza. «BE» è il backend, «FE» il frontend. Per partire basta la **versione 1 del Flusso 1** oppure il **primo giro del Flusso 2**; i punti marcati «versione 2» e «versione 3» sono le evoluzioni del Flusso 1, da fare quando l'app ha utenti veri.

**Prima di andare in produzione**

1. **BE: tutta la sezione «Sicurezza del backend»**, in particolare token breve (Flusso 1), limite ai tentativi, controllo dei ruoli e CORS con elenco preciso.
2. **Privacy e conformità**: informativa, accordi sul trattamento dati, cancellazione ed esportazione, età minima (sezione «Privacy e conformità (UE e Italia)»). Obbligatorio prima della produzione.
3. **BE e FE: `GET /me` e utente solo in memoria**, come descritto in «Il ruolo e i dati dell'utente»: il ruolo non si salva più nello storage e all'avvio si ricostruisce dal backend. Vale per entrambi i flussi.
4. **FE (Flusso 2): integrare Firebase**: `@angular/fire`, login con email e Google, interceptor del token, traduzione degli errori e `POST /me/claim-guest`.
5. **BE e FE (Flusso 1): `POST /auth/logout`** (versione 2). Oggi `AuthService.logout()` cancella solo i dati nel browser: il token resterebbe valido fino alla scadenza. Con il logout il backend lo invalida e il frontend lo chiama prima di pulire.
6. **BE e FE (Flusso 1): refresh token con rotazione** (versione 2). Il frontend dovrebbe, su un 401, provare un solo `POST /auth/refresh` e ripetere la chiamata fallita; solo se anche quello fallisce fa uscire l'utente. Oggi esce subito.
7. **FE: intestazione CSP su Vercel** (`vercel.json`), prima in modalità solo segnalazione (`Content-Security-Policy-Report-Only`) per non rompere stili e font.
8. **FE: la preview di Vercel con l'ambiente di dev.** Oggi `deploy:dev` e `deploy:prod` costruiscono entrambi con `environment.ts` (produzione): il comando di build in `vercel.json` dovrebbe scegliere `build:dev` per le preview.
9. **BE e FE: cookie `httpOnly` al posto dello `localStorage`** (Flusso 1, versione 3), se frontend e backend stanno sullo stesso sito (vedi «Dove si conserva il token: raccomandazione»).

**Poi**

10. **FE: sincronizzare più schede.** Se l'utente esce in una scheda, le altre restano collegate fino alla prima chiamata (reagire all'evento `storage`).
11. **FE (Flusso 1): controllare la scadenza del token** (campo `exp`) prima di una chiamata, per evitare un 401 inutile. Serve solo se non c'è il refresh.
12. **BE e FE: registrazione, recupero password e accesso con Google e Facebook.** Oggi sono segnaposto o simulati. Con il Flusso 2 li fornisce Firebase; con il Flusso 1 il backend deve verificare il token dell'identità (PKCE o ID token) e mai fidarsi del client.
13. **FE: i dati veri al posto di quelli simulati** (classifica, «Manga da scoprire», segnalibri, busta), con la skill `api-service` e aggiornando questo documento a ogni chiamata nuova.
14. **BE: un identificativo di richiesta** (`X-Request-Id`) nei log e nelle risposte, per ritrovare un errore segnalato da un utente.
