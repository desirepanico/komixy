# Struttura del progetto

Albero delle cartelle e regole su dove mettere i file. Le regole essenziali sulle dipendenze sono anche in `CLAUDE.md`.

```
src/
├── app/
│   ├── app.config.ts          provider globali (router, Transloco, ...)
│   ├── app.routes.ts          rotte (lazy loading per feature) ed enum AppRoutes
│   ├── core/                  parti singleton usate da tutta l'app, niente UI di feature
│   │   ├── guards/            auth.guard, user-role.guard
│   │   ├── interceptors/      interceptor HTTP e loader Transloco
│   │   ├── layout/            shell dell'app: sidebar desktop, nav mobile
│   │   ├── models/            modelli e tipi globali (environment, nav-item, comic)
│   │   ├── navigation/        main-pages (ordine delle pagine principali) e direzione delle transizioni
│   │   └── services/          servizi globali (viewport, swipe mobile)
│   ├── features/              una cartella per area funzionale
│   │   └── <feature>/         auth, comics, discover, home, not-found, ranking, releases
│   │       ├── pages/         componenti collegati alle rotte (lazy)
│   │       ├── components/    componenti usati solo da questa feature
│   │       ├── models/        tipi e interfacce della feature
│   │       └── services/      servizi della feature (vedi "Dentro una feature")
│   └── shared/                riutilizzabile da più feature, senza logica di business
│       ├── components/        componenti UI generici: app-tag, appButton, app-horizontal-scroller, ...
│       └── directives/        direttive generiche: appSwipe
├── tailwind.css               tema Tailwind (@theme): colori primary/surface/neutral/violet, radius
├── styles.css                 entry degli stili globali
public/
├── i18n/                      traduzioni Transloco (it.json, en.json)
├── theme/                     theme.css (token, sfondo), glass.css (effetto glass), page-transition.css (transizione tra pagine)
└── fonts/
```

Dove mettere le cose:

- **core**: guard, interceptor, layout dell'app e servizi che esistono una volta sola. Non importare codice da `features`.
- **features**: tutto ciò che appartiene a una sola area. Una feature non importa da un'altra: se due feature condividono qualcosa, spostalo in `shared` (componenti) o in `core` (modelli e servizi).
  - **Eccezione**: `discover` mostra la Top 5 usando la card e il servizio della feature `ranking` (`features/ranking/components`, `features/ranking/services`). La dipendenza è a senso unico: `ranking` non importa mai da `discover`.
- **shared**: solo componenti, direttive e pipe generici e riutilizzabili. Possono essere importati da qualsiasi parte, ma non dipendono da `features`.
- Le dipendenze vanno in una direzione: `features` → `shared` e `core`; `shared` e `core` non dipendono da `features`.

## Dentro una feature

Si crea solo la cartella che serve. Esempio completo, la feature `ranking`:

```
features/ranking/
├── pages/
│   └── ranking-page/
│       ├── ranking-page.ts          componente della rotta (lazy), orchestra la pagina
│       └── ranking-page.html
├── components/
│   └── comic-rank-card/             componente usato solo da questa feature (e da chi la importa)
│       ├── comic-rank-card.ts
│       └── comic-rank-card.html
├── models/
│   └── ranking-entry.model.ts       tipi e interfacce della feature (RankingEntry)
└── services/
    └── weekly-ranking.service.ts    dati e logica della feature (signal + computed)
```

- **pages**: una cartella per pagina, collegata a una rotta in `app.routes.ts`. Contiene solo composizione e stato della pagina; il markup ripetuto va in `components`.
- **components**: componenti della feature, un componente per cartella (`<nome>.ts` + `<nome>.html`, selector `app-<nome>`). Se servono a più feature, vanno in `shared/components`.
- **models**: `*.model.ts`, solo tipi, interfacce e piccole funzioni pure collegate (es. `editionSeverity()`). Se un modello serve a più feature, vai in `core/models` (es. `ComicItem`).
- **services**: `*.service.ts`, `providedIn: 'root'`, con `inject()`. Se il servizio serve a più feature, vai in `core/services`.
- I test `*.spec.ts` stanno accanto al file che testano.

Per aggiungere una feature nuova:

1. Crea `features/<nome>/pages/<nome>-page/` (e le altre cartelle solo se servono).
2. Aggiungi il valore in `AppRoutes` e la rotta con `loadComponent` in `app.routes.ts`.
3. Se è una pagina principale della navigazione mobile, aggiungila a `MAIN_PAGES` (`core/navigation/main-pages.ts`). Una sotto-pagina (es. `discover/ranking`) va come rotta figlia della pagina principale, così la voce di menu resta attiva.
4. Aggiungi i testi in `public/i18n/it.json` e `en.json`.

## Dove vanno le altre cose

- **core/navigation**: ordine delle pagine principali (`main-pages.ts`) e direzione delle transizioni; non contiene UI.
- **core/layout**: shell dell'app (sidebar desktop, nav mobile, contenitore con lo swipe).
- **shared/components**: un componente per cartella, `<nome>.ts` + `<nome>.html` (es. `button/`, `tag/`).
- **shared/directives**: una cartella per direttiva, con l'eventuale logica pura separata e testabile (es. `swipe/swipe.ts` + `swipe/detect-swipe.ts`).
