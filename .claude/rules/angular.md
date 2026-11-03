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
- `changeDetection: ChangeDetectionStrategy.OnPush` in ogni `@Component`.
- Template sempre in un file `.html` accanto al `.ts` (`templateUrl: './nome.html'`), anche per i componenti piccoli. Percorsi relativi al file `.ts`.
- Niente `@HostBinding` e `@HostListener`: usa l'oggetto `host` del decorator.
- `class` e `style` bindings, mai `ngClass` e `ngStyle`.
- Form: preferisci i Reactive Forms.
- `NgOptimizedImage` per le immagini statiche (non funziona con base64 inline).

## Stato e servizi

- Signals per lo stato locale. Niente `mutate`: usa `update` o `set`.
- Trasformazioni di stato pure e prevedibili.
- Servizi con una sola responsabilità, `providedIn: 'root'`, e `inject()` al posto dell'iniezione nel costruttore.

## Template

- Template semplici, senza logica complessa.
- Control flow nativo (`@if`, `@for`, `@switch`), mai `*ngIf`, `*ngFor`, `*ngSwitch`.
- Pipe `async` per gli observable.
- Niente funzioni freccia nei template e niente globali come `new Date()`.

## Routing

- Lazy loading per le rotte delle feature.
