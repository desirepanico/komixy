# Komixy

App per collezionisti di fumetti/manga. Angular 22 (standalone, signals, zoneless, `OnPush`), Tailwind CSS v4 con tema scuro viola, Transloco per i testi, test con Vitest (jsdom), deploy manuale su Vercel. Interfaccia in italiano (`it`), con `en.json` tenuto allineato.

Questo file è sempre caricato e contiene solo l'essenziale. Le regole di dettaglio stanno in `.claude/rules/` (si caricano da sole quando tocchi i file a cui si riferiscono, `git.md` sempre); il contesto esteso in `docs/` (non caricato: aprilo tu quando serve). Una regola si scrive in un solo posto: qui o in `.claude/rules/`, `docs/` spiega e non definisce regole.

## Comandi

- `npm start` (= `npm run start:local`): dev server su http://localhost:4200 col backend sulla propria macchina; `npm run start:dev`: stesso server col backend di dev pubblicato (environment in `src/environments/`, `docs/sviluppo.md`)
- `npm run build`: build di produzione; `npm run build:dev`: build con l'environment di dev
- `npm test`: Vitest (nelle sessioni di Claude Code è già una sola esecuzione; in un terminale interattivo resta in watch, per una sola esecuzione `npm test -- --no-watch`)
- `npm run lint`: ESLint, controllo che ogni `.ts` abbia il suo spec, ordine dei membri di classe (`--fix` riordina)
- `npm run knip`: file, export e dipendenze inutilizzati; gira anche in CI
- `npx prettier --write <file>`: formatta (config in `package.json`)
- `npm run deploy:login | deploy:dev | deploy:prod`: Vercel, sempre manuali (un `git push` non pubblica); `deploy:prod` solo da `master` pulito. Dettagli in `docs/sviluppo.md`

Non serve `npm install` a mano: gli script `pre*` lanciano `scripts/ensure-deps.mjs`.

## Struttura di `src/app`

- **core**: shell dell'app (`guards`, `layout`, `providers` con le funzioni `provideXxx()` raccolte da `provideCore()`). Non importa da `features`; uniche eccezioni, a senso unico: `userRoleGuard` e il `tokenExpiredInterceptor` usano `AuthService`.
- **features**: una cartella per area (`auth`, `comics`, `discover`, `library`, `not-found`, `pack`, `profile`, `ranking`, `releases`) con solo le sottocartelle che servono (`pages/`, `components/`, `models/`, `services/`, `routes/`, `utils/`). Una feature non importa da un'altra; unica eccezione, a senso unico: i servizi `<nome>-navigation` (e la card di `ranking` usata da `discover`).
- **shared**: ciò che serve a più feature o a `core` (`components`, `directives`, `models`, `services`, `constants`, `utils`). Non dipende da `features` né da `core`. Se due feature condividono qualcosa, va qui.
- `src/testing/`: finti per i test, non fa parte dell'app.

Fuori da `src/app`: `public/i18n/` (traduzioni), `public/theme/` (CSS globale), `src/tailwind.css` (tema), `scripts/` (controlli), `.github/workflows/ci.yml`.

Dipendenze in una direzione: `features` → `shared` e `core`. Import con alias `@core/*`, `@shared/*`, `@features/*` (e `@env/*` per `src/environments`) tra aree, percorsi relativi dentro la stessa area, mai `../../../`. Ogni `.ts` sta in una cartella propria con il suo `*.spec.ts` (eccezioni: `*.model.ts`, `*.const.ts`, `main.ts`, file nella radice di `src/app`).

## Routing e navigazione

- `app.routes.ts` monta ogni feature con `loadChildren`; le rotte stanno in `routes/<nome>.routes.ts`, relative e lazy.
- Ogni feature ha `services/<nome>-navigation/` con solo le sue rotte (percorsi per `[routerLink]`, metodi `goToXxx()`, `*UrlTree()` per i guard). Per andare in un'altra feature si inietta il suo servizio. Pagine e componenti non importano `Router` né `AppRoutes` (lo controlla ESLint).
- `/` rimanda a `login`. L'apertura della busta (`discover/pack`) è a schermo intero, fuori dal layout; `discover/ranking` è figlia di `discover`.

### Aggiungere una feature

1. `features/<nome>/pages/<nome>-page/` e `services/<nome>-navigation/`.
2. Valore in `AppRoutes` (`shared/models/app-routes.model.ts`), rotte in `routes/<nome>.routes.ts`, montaggio in `app.routes.ts`, link del servizio di navigazione in `app.routes.spec.ts`.
3. Pagina principale della navigazione mobile: aggiungila a `MAIN_PAGES` (`shared/constants/navigation.const.ts`); una sotto-pagina va come rotta figlia.
4. Testi in `public/i18n/it.json` e `en.json`.

## Dominio

- **Ospiti e iscritti**: `SessionService` dice chi usa l'app. Un ospite può aprire la busta, vedere classifica e dettagli, ma non salvare nelle liste. L'iscritto si rilegge dopo un refresh dallo storage (provvisorio, `TODO(api)`).
- **Busta settimanale**: `WeeklyPackService`. Le 10 carte sono la classifica della settimana; una apertura a settimana ISO, salvata per ora solo in `localStorage` (provvisorio, a regime la gestisce il backend).
- **Dati simulati** nei servizi, con `TODO(api)` per l'API reale.

Pagine, rotte e stato di avanzamento sono in `docs/funzionalita.md`.

## Convenzioni essenziali

Il dettaglio è nelle rules; qui solo ciò che non si deve scordare.

- **PrimeNG è stato rimosso**: non reintrodurlo. HTML nativo + Tailwind. Icone: `@ng-icons/material-symbols`.
- **Signal**: tutto lo stato è un `signal()`, ogni proprietà `readonly`; mai `subscribe()` né pipe `async` (`signals.md`). Ordine dei membri di classe controllato da `npm run lint` (`angular.md`).
- **Chiamate al backend**: `HttpClient` nel servizio, che restituisce il `result` di `ApiResponse`; chi chiama usa `firstValueFrom()` e nel `catch` `ApiErrorService.handle()` (`chiamate-api.md`, skill `api-service`).
- **Form**: solo Signal Forms, con i controlli di `shared/components/input/` (`form.md`).
- **Costanti**: ogni `const` dichiarata sta in `shared/constants` (`costanti.md`).
- **Stato nell'indirizzo**: vista, filtro e ordinamento sono query param, mai nello storage (`query-params.md`).
- **Stile e riuso**: Tailwind nel template con i token del tema; markup ripetuto due volte diventa un componente in `shared/components` (skill `shared-component`); liste orizzontali con `app-horizontal-scroller` e `data-no-swipe` (`stile.md`).
- **Traduzioni**: nessun testo hardcoded, `it.json` e `en.json` con le stesse chiavi (`i18n.md`).
- **Accessibilità**: WCAG AA, `focus-visible`, tutto fattibile anche da tastiera (`accessibilita.md`).
- **Test**: ogni `.ts` ha il suo spec; app zoneless, `await fixture.whenStable()` (`test.md`).
- **Commenti** brevi, in italiano, solo il perché (`commenti.md`). **Codice inutilizzato** (Knip): si toglie, non si nasconde (`knip.md`).

## Flusso git

Le regole sono in `.claude/rules/git.md`. In sintesi: commit e push solo su `develop` e solo dopo l'ok esplicito dell'utente; mai su `master`; mai branch di tua iniziativa; mai `npm run deploy:*` di iniziativa. Prima del commit lancia `npm run lint`, `npm run knip`, `npm run build` e `npm test`; prima del push `git pull --rebase origin develop`. Messaggi in italiano con prefisso `feat:`, `fix:`, `refactor:`, `test:`, `chore:`, `docs:`.

## Claude Code e documentazione

Skill disponibili (descritte in `docs/claude-code.md`):

- `shared-component`: crea o modifica un componente in `shared/components`.
- `use-shared`: usa un componente shared per nome (`/use-shared <nome> [dove]`).
- `api-service`: crea o modifica un servizio che chiama il backend (`/api-service <metodo> <endpoint> [feature]`), con modelli, errori e spec.

Hook, permessi e subagent `reviewer` sono descritti in `docs/claude-code.md`. Se la tua modifica cambia struttura, rotte, funzionalità, hook, comandi, strumenti o dipendenze, aggiorna nello stesso commit il file di `docs/` corrispondente (pagine in `funzionalita.md`, comandi in `sviluppo.md`) e togli ciò che non esiste più.

## Sicurezza

Non leggere né committare file con segreti (`.env*`, `environment.local.ts`, chiavi) e non scrivere chiavi, token o password nei file del repo né in chat. Nei file di `src/environments/` ciò che non si conosce resta il segnaposto `INSERIRE_CHIAVE_PRIVATA` (o `INSERIRE_URL_...`): il valore vero lo mette l'utente; il frontend finisce nel browser, quindi nessuna chiave davvero privata va nel bundle. I permessi sono in `.claude/settings.json`, le esclusioni in `.gitignore`.
