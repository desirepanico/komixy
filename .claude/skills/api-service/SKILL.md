---
name: api-service
description: Crea o modifica un servizio che chiama il backend (es. login, lista fumetti, salvataggio in libreria) con HttpClient, i modelli Request/Response/Filters, la gestione degli errori con ApiErrorService e gli spec. Usare quando l'utente chiede di collegare una pagina o un form a un endpoint, di sostituire dati simulati (TODO(api)) con la chiamata vera o di aggiungere una chiamata a un servizio esistente.
argument-hint: <metodo> <endpoint> [feature]
---

# Servizio per una chiamata al backend

Argomento: `$ARGUMENTS` (es. `POST /auth/register auth`). Lo schema da seguire è `.claude/rules/chiamate-api.md`, con `AuthService.authenticate()` e `LoginForm` come esempio: rileggi la rule e quei due file prima di scrivere.

1. **Raccogli i dati.** Servono metodo, endpoint, body inviato, `result` della risposta, eventuali filtri, e i codici di errore che il backend può restituire. Se manca qualcosa non inventarlo: chiedilo con `AskUserQuestion` (al massimo 4 opzioni per domanda) o con una domanda in chat.
2. **Decidi dove sta.** Nella feature che lo usa (`features/<nome>/services/<nome>/`); in `shared/services` solo se lo usano più feature (regole di dipendenza in `CLAUDE.md`). Se il servizio esiste già, aggiungi il metodo a quello, senza crearne un altro.
3. **Modelli.** In un `*.model.ts` della feature (o `shared/models`): `XxxRequest` per il body, `XxxResponse` per il `result`, `XxxFilters` per la query string. Niente `any`: i tipi che arrivano dal backend sono interfacce.
4. **Servizio.** `inject(HttpClient)`, gruppo di indirizzi in `private readonly _apiGroup`, membri privati con `_`, indirizzi relativi. Metodo che restituisce `Observable<XxxResponse>` con `map((response) => response.result)`; i dati da inviare (`POST`/`PUT`/`PATCH`, e sempre quelli personali come le credenziali) vanno nel body come `XxxRequest`, mentre i filtri di una lettura (`GET`) passano da `apiUrl(path, filters)` di `shared/utils/api-url` come `XxxFilters`, vedi «Body o query string» nella rule; gli effetti sullo stato in `tap()`. Se prima c'erano dati simulati, toglili con il loro `TODO(api)`; se la chiamata non è ancora disponibile lascia il `TODO(api)` con endpoint e metodo.
5. **Chi chiama.** Nel componente o nel form: `firstValueFrom()` in una funzione `async` con `try/catch`, mai `subscribe()` né pipe `async` (regole in `signals.md`). Nel `catch` chiama `ApiErrorService.handle(error, { summary, detail })` con il messaggio di default della feature (chiavi `<feature>.serverError.summaryKo` / `detailKo`): un solo messaggio di default per feature, riusato se esiste. Per i form l'`action` torna `undefined` (`form.md`).
6. **Codici di errore.** Per ogni codice noto del backend: voce in `API_ERROR_MESSAGES` (`shared/constants/api-error.const.ts`), chiavi `apiError.<gruppo>.summaryKo` e `detailKo` in `public/i18n/it.json` e `en.json` (stessa struttura), caso nello spec di `ApiErrorService`. Se il codice c'è già, riusalo.
7. **Traduzioni.** Le chiavi nuove vanno in `it.json` e `en.json`, senza valori vuoti e senza chiavi che non usi (`i18n.md`).
8. **Test.** Spec del servizio con `provideHttpClient()`, `provideHttpClientTesting()` e `HttpTestingController` (metodo, body, `result` restituito, effetti sullo stato, errore HTTP con corpo `ApiResponse`, errore di rete, `http.verify()`); spec del componente con `authenticate`-simile finto tramite `vi.spyOn` e un `Subject`, controllando il toast. Regole in `test.md` e ricette in `docs/sviluppo.md`.
9. **Documentazione.** Se la chiamata cambia una pagina o un comportamento, aggiorna `docs/funzionalita.md`; se cambia lo schema delle chiamate, aggiorna la rule e questa skill.
10. **Verifica** con `npm run lint`, `npm run knip`, `npm test -- --no-watch` e `npm run build`. Niente commit né push senza ok esplicito (`.claude/rules/git.md`).
