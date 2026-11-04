# Architettura

## Stack

- Angular 22: componenti standalone, signals, `OnPush` (default), zoneless, control flow nativo
- Tailwind CSS v4 (tema in `src/tailwind.css`)
- Transloco per le traduzioni
- Icone con `@ng-icons/material-symbols`
- Test con Vitest (`ng test`)
- Hosting su Vercel (single page app, vedi [sviluppo.md](sviluppo.md))

PrimeNG è stato rimosso e non va reintrodotto.

## Struttura di `src/app`

```
core/       shell dell'app: guards, interceptors, layout, providers (provideCore)
features/   una cartella per area: auth, comics, discover, not-found, ranking, releases
shared/     componenti, direttive, modelli, servizi e costanti condivisi tra feature (constants, models, services)
```

Ogni feature può avere `pages/`, `components/`, `models/`, `services/`: si crea solo quello che serve. Ogni file `.ts` ha il suo `*.spec.ts` accanto (vedi `docs/sviluppo.md`).

### Regole sulle dipendenze

- `features` → `shared` e `core`; `core` → `shared`; `shared` e `core` non importano mai da `features`, e `shared` non importa da `core`. Eccezione: il guard `userRoleGuard` (`core/guards`) importa `AuthService` da `features/auth`; la dipendenza è a senso unico e `auth` non importa da `core`.
- Una feature non importa da un'altra. Eccezione: `discover` usa la card di `ranking` (a senso unico). Il servizio `WeeklyRankingService` è in `shared/services`.
- Se due feature condividono qualcosa, va in `shared` (componenti, direttive, modelli, servizi, costanti). `core` contiene solo ciò che serve alla shell dell'app (layout, guard, interceptor, provider di avvio): niente modelli, servizi o costanti.

## Routing

Le rotte principali sono in `app.routes.ts`, con lazy loading per feature. Le feature con più pagine hanno un file `routes/<nome>.routes.ts` caricato con `loadChildren` (`discover`, `comics`). L'enum `AppRoutes` sta in `shared/constants/app-routes/app-routes.const.ts`, così nessuna area dipende da `app.routes.ts`.

- Tutte le pagine stanno dentro il layout (`core/layout`), tranne la pagina 404 (`**`).
- `/` reindirizza a `discover`; `discover/ranking` è una rotta figlia, così la voce di menu resta attiva.
- `comic/:id` è una rotta figlia di `comic`: per ora usa lo stesso componente segnaposto, la pagina di dettaglio non è ancora implementata.
- Il router usa le view transitions e il ripristino dello scroll.

### Navigazione principale

`MAIN_PAGES` in `shared/constants/main-pages/main-pages.const.ts` è l'elenco ordinato delle pagine principali: Scopri, Uscite, Libreria, Profilo. È usato dalla nav mobile, dallo swipe tra pagine e dalla direzione delle transizioni. Le zone che scorrono in orizzontale devono avere `data-no-swipe`.

## Provider

Un provider dice al sistema di dependency injection di Angular come creare o configurare qualcosa (un servizio, un'opzione, un'operazione da fare all'avvio). Nel progetto ce ne sono di quattro tipi, dal più globale al più locale:

| Tipo | Dove | Esempio |
|---|---|---|
| Configurazione dell'app | `app.config.ts` | `provideRouter(...)`, `provideBrowserGlobalErrorListeners()`, `provideCore()` |
| Funzioni di avvio `provideXxx()` | `core/providers/<nome>/<nome>.provider.ts` | `provideI18n()`, `provideNavDirection()` |
| Servizi `providedIn: 'root'` | `shared/services`, `features/*/services` | `ViewportService`, `AuthService`, `WeeklyRankingService` |
| Provider di componente | `providers: [...]` nel decorator | `provideIcons({ matXxxOutline })` |

**Funzioni di avvio.** Ogni `provideXxx()` restituisce `EnvironmentProviders` (`makeEnvironmentProviders`) e raccoglie tutto ciò che serve a una funzione dell'app:

- `provideI18n()` configura Transloco (lingua `it`, loader HTTP) e, con `provideAppInitializer`, carica le traduzioni prima che l'app parta, così la prima schermata è già tradotta.
- `provideNavDirection()` registra con `provideAppInitializer` un ascolto sul router che imposta `data-nav-direction` su `<html>`; il CSS lo usa per la transizione tra pagine.
- `provideCore()` (`core/providers/core/core.provider.ts`) le mette insieme: `app.config.ts` registra solo quella.

`provideAppInitializer` esegue codice all'avvio; se restituisce una `Promise` o un `Observable`, Angular aspetta che finisca prima di mostrare l'app.

**Servizi `providedIn: 'root'`.** Sono registrati da soli: un'unica istanza per tutta l'app, e finiscono nel bundle solo se qualcuno li usa. Non vanno elencati in nessun `providers`.

**Provider di componente.** `provideIcons` registra solo le icone usate dal componente, così le altre non entrano nel suo chunk lazy. Il provider vive quanto il componente.

Regole:

- Un nuovo provider globale è una funzione `provideXxx()` in `core/providers/<nome>/<nome>.provider.ts`, aggiunta all'elenco di `provideCore()`. In `app.config.ts` si lascia solo ciò che riguarda il router e `provideCore()`.
- Un servizio non ha bisogno di un provider: usa `providedIn: 'root'` e `inject()`. Un provider esplicito serve solo per configurare qualcosa (opzioni, token, valori diversi per ambiente).
- I provider che dipendono dal router o da altre librerie restano nel posto che le configura: non spostare `provideRouter` in `provideCore()`.
- Gli interceptor HTTP si registrano con `provideHttpClient(withInterceptors([...]))` in `core/providers/core/core.provider.ts`, quando ce ne sarà uno.
- Niente `NgModule` né `importProvidersFrom`, se esiste una funzione `provideXxx()` della libreria.

## Accesso e ruoli

- `AuthService` (`features/auth`) tiene l'utente loggato in un signal.
- `userRoleGuard(ruolo)` (`core/guards`) reindirizza al login chi non è autenticato e a `discover` chi non ha il ruolo richiesto.

## Dati

I dati sono ancora simulati nei servizi (es. `WeeklyRankingService`, con `TODO` per l'API reale). `shared/models/environment.model.ts` descrive la configurazione dell'API (`baseUrl`, `publicKey`).
