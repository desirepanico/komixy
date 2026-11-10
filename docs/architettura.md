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
features/   una cartella per area: auth, comics, discover, library, not-found, profile, ranking, releases
shared/     componenti, direttive, modelli, servizi e costanti condivisi tra feature (constants, models, services)
```

Ogni feature può avere `pages/`, `components/`, `models/`, `services/`: si crea solo quello che serve. Ogni file `.ts` ha il suo `*.spec.ts` accanto (vedi `docs/sviluppo.md`).

### Regole sulle dipendenze

- `features` → `shared` e `core`; `core` → `shared`; `shared` e `core` non importano mai da `features`, e `shared` non importa da `core`. Eccezione: il guard `userRoleGuard` (`core/guards`) importa `AuthService` da `features/auth`; la dipendenza è a senso unico e `auth` non importa da `core`.
- Una feature non importa da un'altra. Eccezioni, a senso unico: i servizi di navigazione (`<nome>-navigation`, vedi "Navigazione delle feature") e la card di `ranking` usata da `discover`. `WeeklyRankingService` è in `shared/services`.
- Se due feature condividono qualcosa, va in `shared` (componenti, direttive, modelli, servizi, costanti). `core` contiene solo ciò che serve alla shell dell'app (layout, guard, interceptor, provider di avvio): niente modelli, servizi o costanti.

## Routing

`app.routes.ts` monta le feature sui loro percorsi, sempre con lazy loading (`loadChildren`). Ogni feature ha le sue rotte in `features/<nome>/routes/<nome>.routes.ts` (`DISCOVER_ROUTES`, `RANKING_ROUTES`, `COMICS_ROUTES`, `RELEASES_ROUTES`, `LIBRARY_ROUTES`, `PROFILE_ROUTES`, `AUTH_ROUTES`, `NOT_FOUND_ROUTES`): sono relative alla radice della feature, senza il suo percorso, così la feature non conosce dove è montata e non importa le altre. L'enum `AppRoutes` sta in `shared/models/app-routes.model.ts`, così nessuna area dipende da `app.routes.ts`.

- Tutte le pagine stanno dentro il layout (`core/layout`), tranne il login (`login`) e la pagina 404 (`**`).
- `/` reindirizza a `discover`; `discover/ranking` è montata come figlia di `discover` (le rotte sono della feature `ranking`), così la voce di menu resta attiva.
- `comic/:id` è una rotta figlia di `comic`: per ora usa lo stesso componente segnaposto, la pagina di dettaglio non è ancora implementata.
- Il router usa le view transitions e il ripristino dello scroll.

### Navigazione delle feature

Ogni feature ha il suo servizio di navigazione (`features/<nome>/services/<nome>-navigation/`), in coppia con le sue rotte (`routes/<nome>.routes.ts`):

- contiene **solo le rotte della propria feature**: `DiscoverNavigationService` ha la pagina Scopri, `RankingNavigationService` la classifica, `ComicsNavigationService` i fumetti, `AuthNavigationService` il login, `ReleasesNavigationService` le uscite, `LibraryNavigationService` la libreria, `ProfileNavigationService` il profilo, `NotFoundNavigationService` la pagina 404;
- espone i **percorsi** per i link (`discoverLink`, `detailLink(id)`), usati con `[routerLink]`: i link restano `<a>`; ha i metodi `goToXxx()` per navigare da codice e i `*UrlTree()` per i guard;
- usa percorsi assoluti, costruiti con `AppRoutes` (`shared`);
- **per andare in un'altra feature si inietta il suo servizio**: la pagina della classifica torna a Scopri con `DiscoverNavigationService`, la card di Scopri porta al fumetto con `ComicsNavigationService`, `AuthNavigationService` dopo il login usa `DiscoverNavigationService`. È l'unico import ammesso tra feature (oltre alla card della classifica per `discover`);
- il test `app.routes.spec.ts` verifica che ogni link dei servizi porti alla pagina della sua feature.

Così ogni percorso è scritto in un solo servizio, e pagine e componenti delle feature non conoscono né `Router` né `AppRoutes` (ESLint lo impedisce, insieme agli import tra feature). Il menu in `core/layout` è l'eccezione: `core` non può usare i servizi delle feature, quindi costruisce i suoi link con `AppRoutes` e `MAIN_PAGES`.

## Provider

Un provider dice al sistema di dependency injection di Angular come creare o configurare qualcosa (un servizio, un'opzione, un'operazione da fare all'avvio). Nel progetto ce ne sono di quattro tipi, dal più globale al più locale:

| Tipo | Dove | Esempio |
|---|---|---|
| Configurazione dell'app | `app.config.ts` | `provideRouter(...)`, `provideBrowserGlobalErrorListeners()`, `provideCore()` |
| Funzioni di avvio `provideXxx()` | `core/providers/<nome>/<nome>.provider.ts` | `provideI18n()`, `provideNavDirection()`, `provideBootSkeleton()` |
| Servizi `providedIn: 'root'` | `shared/services`, `features/*/services` | `ViewportService`, `ToastService`, `AuthService`, `WeeklyRankingService` |
| Provider di componente | `providers: [...]` nel decorator | `provideIcons({ matXxxOutline })` |

**Funzioni di avvio.** Ogni `provideXxx()` restituisce `EnvironmentProviders` (`makeEnvironmentProviders`) e raccoglie tutto ciò che serve a una funzione dell'app:

- `provideI18n()` configura Transloco (lingua `it`, loader HTTP) e, con `provideAppInitializer`, carica le traduzioni prima che l'app parta, così la prima schermata è già tradotta.
- `provideNavDirection()` registra con `provideAppInitializer` un ascolto sul router che imposta `data-nav-direction` su `<html>`; il CSS lo usa per la transizione tra pagine.
- `provideBootSkeleton()` toglie lo skeleton di avvio di `index.html` (`#skeleton`, fuori da `<app-root>`) dopo la prima navigazione finita. Finché c'è, il CSS in `index.html` nasconde `<app-root>`: così, mentre arrivano i chunk lazy, non si vede lo sfondo viola vuoto.
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

I dati sono ancora simulati nei servizi (es. `WeeklyRankingService`, con `TODO` per l'API reale).
