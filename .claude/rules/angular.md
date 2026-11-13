---
paths:
  - "src/app/**/*.ts"
  - "src/app/**/*.html"
---

# Regole Angular e TypeScript

## TypeScript

- Type checking strict.
- Preferisci l'inferenza quando il tipo è ovvio. Eccezione: `signal()`, `input()`, `model()` e `output()` hanno sempre il tipo scritto (`model<string>('')`, `input<boolean>(false)`, `signal<number>(0)`): si vede subito cosa contengono e un valore iniziale diverso (`null`, `[]`) non ne cambia il tipo in silenzio. Negli spec basta l'inferenza.
- Evita `any`: usa `unknown` quando il tipo è incerto.

## Componenti

- Solo componenti standalone, mai NgModule. Non scrivere `standalone: true` (è il default da Angular 20).
- Componenti piccoli, con una sola responsabilità.
- `OnPush` è il default da Angular 22: non scrivere `changeDetection`. Mai `ChangeDetectionStrategy.Eager`.
- App zoneless (senza zone.js): regole sui signal in `signals.md`.
- Template sempre in un file `.html` accanto al `.ts` (`templateUrl: './nome.html'`), anche per i componenti piccoli. Percorsi relativi al file `.ts`.
- Niente `@HostBinding` e `@HostListener`: usa l'oggetto `host` del decorator.
- `class` e `style` bindings, mai `ngClass` e `ngStyle`.
- Form: Signal Forms, regole in `.claude/rules/form.md`.
- `NgOptimizedImage` per le immagini statiche (non funziona con base64 inline).

## Cartelle

- Ogni file `.ts` con il suo spec sta in una **cartella propria**, con dentro solo lui, il suo `*.spec.ts` e, per un componente, il suo `.html`. La cartella ha il nome del file senza il tipo: `services/viewport/viewport.service.ts` + `viewport.service.spec.ts`, `guards/user-role/user-role.guard.ts`, `providers/i18n/i18n.provider.ts`.
- Un file di logica che serve solo a un altro (es. `detect-swipe`) ha la sua cartella dentro quella del file che lo usa: `directives/swipe/detect-swipe/`.
- Le funzioni pure usate da **due o più aree** (feature, `core`, componenti shared) stanno in `shared/utils/<nome>/<nome>.ts`, una funzione per cartella con il suo spec (`shared/utils/edition-severity/`). Una funzione usata da una sola area resta accanto a chi la usa, non in `utils`. Niente funzioni in `*.const.ts` né in `*.model.ts`, e niente file generici tipo `helpers.ts`.
- Le rotte di una feature stanno in `routes/<nome>.routes.ts`.
- Eccezioni: i file `*.model.ts` (nessuno spec) restano nella cartella del loro tipo (`models/`) e i `*.const.ts` in `shared/constants/`, tutti insieme; `main.ts` e i file nella radice di `src/app` (`app.ts`, `app.config.ts`, `app.routes.ts`) restano dove sono. Lo controlla `npm run lint` (`scripts/check-specs.mjs`).

## Nomi

- File in kebab-case, con il tipo nel nome: `comic.model.ts`, `auth.service.ts`, `user-role.guard.ts`, `swipe.directive.ts`, `auth.interceptor.ts`, `i18n.provider.ts` (funzione `provideXxx()` di avvio), `ui.const.ts` (costanti), `login-page.spec.ts` (test). Componenti e pagine senza `.component`: `comic-card.ts`, `discover-page.ts` (le pagine finiscono con `-page`).
- Classi in PascalCase, con il suffisso del tipo dove il file lo ha: `AuthService`, `DiscoverPage`. Componenti e direttive senza suffisso: `ComicCard`, `Swipe`.
- Ogni membro `private` (proprietà, metodo, accessor, parametro del costruttore) ha il nome che inizia con `_`: `private readonly _router = inject(Router)`, `private _read()`. I membri `protected` e `public` non lo hanno. Lo controlla ESLint (`@typescript-eslint/naming-convention`).
- Modelli delle chiamate API, in un `*.model.ts`: il body inviato finisce sempre per `Request` (`LoginRequest`), la risposta (il `result` di `ApiResponse<T>`) per `Response` (`LoginResponse`, `ComicListResponse`), i filtri passati nella query string per `Filters` (`ComicListFilters`, si passano a `apiUrl()` in `shared/utils/api-url`). `ApiResponse` è la busta comune.
- Le costanti stanno in `shared/constants`, un file per argomento: regole in `.claude/rules/costanti.md`.
- Le funzioni pure (`detect-swipe.ts`) senza suffisso: il nome dice già cosa sono.
- Prefisso `app` per tutti i componenti e le direttive, sia generici (`shared`) sia di feature: selector `app-nome` (componenti), `[appNome]` (direttive e componenti ad attributo come `button[appButton]`).

## Ordine dei membri

Dentro una classe (componente, direttiva, servizio) i membri stanno in quest'ordine, raggruppati, con una riga vuota tra un gruppo e l'altro:

1. `inject()`
2. altre proprietà semplici (costanti per il template, valori derivati da un servizio): vengono prima dei signal perché i signal le leggono quando la classe viene creata
3. query: `viewChild()`, `viewChildren()`, `contentChild()`
4. `input()`, `model()`, `output()`
5. signal: `signal()`, `computed()`, `linkedSignal()`, `toSignal()`, `form()` e alias (`x.asReadonly()`, `this.servizio.vista`)
6. `constructor`
7. metodi

Lo controlla `npm run lint` (`scripts/check-class-order.mjs`); `node scripts/check-class-order.mjs --fix` riordina e poi si lancia Prettier. Non vale per le classi `Host` degli spec.

## Stato e servizi

- Signal, `computed`, `effect` e simili: `signals.md`.
- Membri usati solo nel template: `protected`.
- Trasformazioni di stato pure e prevedibili.
- Servizi con una sola responsabilità, `providedIn: 'root'`, e `inject()` al posto dell'iniezione nel costruttore.
- Provider globali: funzioni `provideXxx()` in `core/providers`, raccolte da `provideCore()` (vedi `docs/architettura.md`). Mai `NgModule` né `importProvidersFrom` se esiste una funzione `provideXxx()`.

## Template

- Template semplici, senza logica complessa.
- Control flow nativo (`@if`, `@for`, `@switch`), mai `*ngIf`, `*ngFor`, `*ngSwitch`.
- Niente pipe `async`: un observable diventa un signal con `toSignal()` (regole in `signals.md`).
- Niente funzioni freccia nei template e niente globali come `new Date()`.

## Import

- Alias `@core/*`, `@shared/*`, `@features/*` (definiti in `tsconfig.json`) per importare da un'altra area; `@env/*` per gli environment (`import { environment } from '@env/environment'`); percorsi relativi dentro la stessa area o feature. Mai `../../../`.

## Routing

- Lazy loading per le rotte delle feature.
- **Ogni feature ha le sue rotte**, in `routes/<nome>.routes.ts` (`export const DISCOVER_ROUTES: Routes`): rotte **relative** alla radice della feature (`path: ''`), con `loadComponent` per le pagine. Non scrivono il percorso della feature e non importano altre feature. `app.routes.ts` le monta sul loro percorso con `loadChildren` e `AppRoutes`.
- Rotte e servizio di navigazione vanno in coppia: i link e i metodi del servizio devono portare a pagine che le rotte della feature (montate in `app.routes.ts`) servono davvero. Lo verifica `app.routes.spec.ts`: aggiungendo un link a un servizio si aggiunge la riga del test.
- **Ogni feature ha un servizio di navigazione**: `services/<feature>-navigation/<feature>-navigation.service.ts` (`DiscoverNavigationService`). Contiene **solo le rotte della propria feature** (le sue pagine): niente percorsi di altre feature.
- Il servizio espone i **percorsi** come proprietà o metodi (`discoverLink`, `detailLink(id)`), usati nei template con `[routerLink]="rankingNavigation.rankingLink"`: i link restano `<a>` (accessibilità). Per navigare **da codice**, dopo un'azione, ha i metodi `goToXxx()` (`goToDiscover()`); per i guard i `*UrlTree()`. Percorsi assoluti (`['/', ...]`): un link relativo cambia destinazione secondo la pagina in cui sta.
- **Per andare in un'altra feature si inietta il suo servizio di navigazione** (`DiscoverNavigationService`, `ComicsNavigationService`): è l'unico import ammesso tra feature. Il campo ha il nome del servizio (`rankingNavigation`, `comicsNavigation`) per chiarire di chi sono le rotte. Lo controlla ESLint.
- Pagine e componenti delle feature non importano `Router` né `AppRoutes` (lo controlla ESLint): usano i servizi di navigazione. Eccezione: il layout in `core/layout` (sidebar e barra mobile) costruisce il menu e `core` non importa dalle feature, quindi usa `AppRoutes` e `MAIN_PAGES` di `shared`; ESLint non lo controlla.
