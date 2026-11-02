# Komixy

App Angular 21 (standalone, signals) per collezionisti di fumetti/manga. Stile: Tailwind CSS v4, tema scuro viola (`primary-*` / `surface-*` definiti in `src/tailwind.css`), effetto "glass" in `public/theme/glass.css`.

Le regole dettagliate sono in `.claude/rules/` (Angular, stile, accessibilità, test). Questo file contiene solo l'essenziale.

## Comandi

- `npm start` — dev server su http://localhost:4200
- `npm run build` — build di produzione (da lanciare prima di ogni commit)
- `npm test` — test con Vitest
- `npm run deploy:login` — accesso a Vercel (da fare una volta sola)
- `npm run deploy:dev` — pubblica una preview su Vercel (usa `vercel.json`)
- `npm run deploy:prod` — pubblica in produzione su Vercel (indirizzo pubblico del progetto)

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
│   │   ├── navigation/        main-pages (ordine delle pagine principali) e direzione delle transizioni
│   │   └── services/          servizi globali (viewport, swipe mobile)
│   ├── features/              una cartella per area funzionale
│   │   └── <feature>/         auth, comics, discover, home, not-found, releases
│   │       ├── pages/         componenti collegati alle rotte (lazy)
│   │       ├── components/    componenti usati solo da questa feature
│   │       ├── models/        tipi e interfacce della feature
│   │       └── services/      servizi della feature
│   └── shared/                riutilizzabile da più feature, senza logica di business
│       ├── components/        componenti UI generici: app-tag, appButton, app-horizontal-scroller, ...
│       └── directives/        direttive generiche: appSwipe
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

## Convenzioni

- **PrimeNG è stato rimosso**: non reintrodurlo. Usa elementi HTML nativi + classi Tailwind.
- Icone: `@ng-icons/material-symbols` (`<ng-icon name="matXxxOutline" />`, registrate in `provideIcons`). Niente classi `pi pi-*`.
- Traduzioni: Transloco, file in `public/i18n/` (lingua `it`). Nessun testo hardcoded nei template.
- Commenti nel codice e messaggi di commit in italiano.
- Componenti riutilizzabili: usa la skill `shared-component`.
- Swipe tra pagine: la lista delle pagine principali è `MAIN_PAGES` in `core/navigation/main-pages.ts` (usata da nav mobile, swipe e transizioni). Le zone che scorrono in orizzontale devono avere `data-no-swipe`.

## Flusso git

- Si lavora direttamente su `develop`, senza creare branch (salvo richiesta esplicita).
- Prima di ogni commit lancia `npm run build`. Prima del push fai `git pull --rebase origin develop`.
- Messaggi di commit in italiano, con prefisso `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`.

## Sicurezza

- Non leggere né committare file con segreti (`.env*`, `environment.local.ts`, chiavi). I permessi sono in `.claude/settings.json`, le esclusioni in `.gitignore`.
- Non scrivere chiavi, token o password nei file del repo né nella chat.
