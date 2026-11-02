# Komixy

App Angular 21 (standalone, signals) per collezionisti di fumetti/manga. Stile: Tailwind CSS v4, tema scuro viola (`primary-*` / `surface-*` definiti in `src/tailwind.css`), effetto "glass" in `public/theme/glass.css`.

## Comandi

- `npm start` — dev server su http://localhost:4200
- `npm run build` — build di produzione (da lanciare prima di ogni commit)
- `npm test` — test con Vitest
- `npm run deploy:login` — accesso a Vercel (da fare una volta sola)
- `npm run deploy:dev` — pubblica una preview su Vercel (usa `vercel.json`)

## Struttura del progetto

```
src/
├── app/
│   ├── app.config.ts          provider globali (router, Transloco, ...)
│   ├── app.routes.ts          rotte (lazy loading per feature) ed enum AppRoutes
│   ├── core/                  parti singleton usate da tutta l'app, niente UI di feature
│   │   ├── guards/            auth.guard, user-role.guard
│   │   ├── interceptors/      interceptor HTTP e loader Transloco
│   │   ├── layout/            shell dell'app: sidebar desktop, nav mobile
│   │   ├── models/            modelli e tipi globali (environment, nav-item)
│   │   └── services/          servizi globali (viewport, swipe mobile)
│   ├── features/              una cartella per area funzionale
│   │   └── <feature>/         auth, comics, discover, home, not-found, releases
│   │       ├── pages/         componenti collegati alle rotte (lazy)
│   │       ├── components/    componenti usati solo da questa feature
│   │       ├── models/        tipi e interfacce della feature
│   │       └── services/      servizi della feature
│   └── shared/                riutilizzabile da più feature, senza logica di business
│       └── components/        componenti UI generici: app-tag, appButton, ...
├── tailwind.css               tema Tailwind (@theme): colori primary/surface/neutral/violet, radius
├── styles.css                 entry degli stili globali
public/
├── i18n/                      traduzioni Transloco (it.json, en.json)
├── theme/                     theme.css (token, sfondo), glass.css (effetto glass)
└── fonts/
```

Dove mettere le cose:

- **core**: guard, interceptor, layout dell'app e servizi che esistono una volta sola. Non importare codice da `features`.
- **features**: tutto ciò che appartiene a una sola area. Una feature non importa da un'altra: se due feature condividono qualcosa, spostalo in `shared`.
- **shared**: solo componenti, direttive e pipe generici e riutilizzabili. Possono essere importati da qualsiasi parte, ma non dipendono da `features`.
- Le dipendenze vanno in una direzione: `features` → `shared` e `core`; `shared` e `core` non dipendono da `features`.

## Convenzioni del progetto

- **PrimeNG è stato rimosso**: non reintrodurlo. Usa elementi HTML nativi + classi Tailwind.
- Icone: `@ng-icons/material-symbols` (`<ng-icon name="matXxxOutline" />`, registrate in `provideIcons`). Niente classi `pi pi-*`.
- Traduzioni: Transloco, file in `public/i18n/` (lingua `it`). Nessun testo hardcoded nei template.
- Struttura: vedi la sezione "Struttura del progetto" qui sotto.
- Commenti nel codice e messaggi di commit in italiano.
- Componenti riutilizzabili in `src/app/shared/components/<nome>/` (selector `app-<nome>`, usati da più feature). Prima di scrivere markup duplicato controlla se esiste già un componente shared (es. `app-tag` per le etichette, `appButton` per i bottoni: `<button appButton>`, `<a appButton routerLink>`). Niente classi CSS globali per componenti: stile con Tailwind dentro il componente.
- Colori solo dai token del tema in `src/tailwind.css` (`primary-*`, `surface-*`, `neutral-*`, `violet-*`). Vietati hex e colori di default di Tailwind (`white`, `black`, `red-500`, `gray-*`, ...): se serve una tinta nuova, aggiungila prima come token in `@theme`. In CSS usa `var(--color-<nome>)`.

## Linee guida generali

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.
- Do not write arrow functions in templates (they are not supported).

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
