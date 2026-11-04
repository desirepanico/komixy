---
paths:
  - "src/app/**/*.ts"
  - "src/app/**/*.html"
---

# Regole Angular e TypeScript

## TypeScript

- Type checking strict.
- Preferisci l'inferenza quando il tipo è ovvio.
- Evita `any`: usa `unknown` quando il tipo è incerto.

## Componenti

- Solo componenti standalone, mai NgModule. Non scrivere `standalone: true` (è il default da Angular 20).
- Componenti piccoli, con una sola responsabilità.
- `input()` e `output()` al posto dei decorator.
- `computed()` per lo stato derivato.
- `OnPush` è il default da Angular 22: non scrivere `changeDetection`. Mai `ChangeDetectionStrategy.Eager`.
- App zoneless (senza zone.js): lo stato che cambia la vista deve stare in un signal.
- Template sempre in un file `.html` accanto al `.ts` (`templateUrl: './nome.html'`), anche per i componenti piccoli. Percorsi relativi al file `.ts`.
- Niente `@HostBinding` e `@HostListener`: usa l'oggetto `host` del decorator.
- `class` e `style` bindings, mai `ngClass` e `ngStyle`.
- Form: preferisci i Reactive Forms.
- `NgOptimizedImage` per le immagini statiche (non funziona con base64 inline).

## Nomi

- File in kebab-case, con il tipo nel nome: `comic.model.ts`, `auth.service.ts`, `user-role.guard.ts`, `swipe.directive.ts`, `auth.interceptor.ts`, `i18n.provider.ts` (funzione `provideXxx()` di avvio), `app-routes.const.ts` (costanti), `login-page.spec.ts` (test). Componenti e pagine senza `.component`: `comic-card.ts`, `discover-page.ts` (le pagine finiscono con `-page`).
- Classi in PascalCase, con il suffisso del tipo dove il file lo ha: `AuthService`, `DiscoverPage`. Componenti e direttive senza suffisso: `ComicCard`, `Swipe`.
- Le costanti stanno in `shared/constants`, un file per costante, con `.const.ts` nel nome (`app-routes.const.ts`, `main-pages.const.ts`). Nel codice le costanti sono `readonly` e in `UPPER_SNAKE_CASE` (`MAIN_PAGES`); un enum resta in PascalCase (`AppRoutes`).
- Le funzioni pure (`detect-swipe.ts`) senza suffisso: il nome dice già cosa sono.
- Prefisso `app` per tutti i componenti e le direttive, sia generici (`shared`) sia di feature: selector `app-nome` (componenti), `[appNome]` (direttive e componenti ad attributo come `button[appButton]`).

## Stato e servizi

- Signals per lo stato locale. Niente `mutate`: usa `update` o `set`, restituendo un nuovo oggetto o array (mai modificare quello dentro il signal).
- Ogni signal, `input()`, `output()` e `viewChild()` è `readonly` (lo controlla ESLint). Un signal che non cambia mai non è un signal: usa una costante.
- Valori derivati con `computed()`, non con funzioni o getter che leggono un signal.
- Stato derivato ma modificabile: `linkedSignal()`. Dati asincroni da una richiesta: `resource()` / `httpResource()`. Effetti collaterali: `effect()` solo quando serve, mai per sincronizzare signal tra loro.
- Costanti usate nel template (es. `AppRoutes`): `protected readonly AppRoutes = AppRoutes;`, senza signal.
- Membri usati solo nel template: `protected`.
- Trasformazioni di stato pure e prevedibili.
- Servizi con una sola responsabilità, `providedIn: 'root'`, e `inject()` al posto dell'iniezione nel costruttore.
- Provider globali: funzioni `provideXxx()` in `core/providers`, raccolte da `provideCore()` (vedi `docs/architettura.md`). Mai `NgModule` né `importProvidersFrom` se esiste una funzione `provideXxx()`.

## Template

- Template semplici, senza logica complessa.
- Control flow nativo (`@if`, `@for`, `@switch`), mai `*ngIf`, `*ngFor`, `*ngSwitch`.
- Pipe `async` per gli observable.
- Niente funzioni freccia nei template e niente globali come `new Date()`.

## Import

- Alias `@core/*`, `@shared/*`, `@features/*` (definiti in `tsconfig.json`) per importare da un'altra area; percorsi relativi dentro la stessa area o feature. Mai `../../../`.

## Routing

- Lazy loading per le rotte delle feature.
