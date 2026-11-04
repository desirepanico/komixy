# Struttura del progetto

Albero delle cartelle e regole su dove mettere i file. Le regole essenziali sulle dipendenze sono anche in `CLAUDE.md`.

```
src/
├── app/
│   ├── app.config.ts          provider globali (router, Transloco, ...)
│   ├── app.routes.ts          rotte principali (lazy loading per feature)
│   ├── core/                  parti singleton usate da tutta l'app, niente UI di feature
│   │   ├── guards/            user-role.guard
│   │   ├── interceptors/      interceptor HTTP (si crea con il primo interceptor)
│   │   ├── layout/            shell dell'app: sidebar desktop, nav mobile
│   │   ├── models/            modelli, tipi e costanti globali (comic, environment, nav-item, AppRoutes, MAIN_PAGES)
│   │   └── services/          servizi globali (viewport, swipe mobile, loader Transloco) e provider di avvio (i18n, direzione delle transizioni)
│   ├── features/              una cartella per area funzionale
│   │   └── <feature>/         auth, comics, discover, not-found, ranking, releases
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

- **core**: `models`, `services`, `guards`, `interceptors` e `layout`: tutto ciò che esiste una volta sola per l'app. Non importare codice da `features`.
- **features**: tutto ciò che appartiene a una sola area. Una feature non importa da un'altra: se due feature condividono qualcosa, spostalo in `shared` (componenti) o in `core` (modelli e servizi).
  - **Eccezione**: `core` importa da `features/auth` (modello utente e `AuthService`, usati da guard, navigazione e sidebar). La dipendenza è a senso unico: `auth` non importa da `core/layout`.
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

- **pages**: una cartella per pagina, collegata a una rotta in `app.routes.ts` o nel `<nome>.routes.ts` della feature. Contiene solo composizione e stato della pagina; il markup ripetuto va in `components`.
- **components**: componenti della feature, un componente per cartella (`<nome>.ts` + `<nome>.html`, selector `app-<nome>`). Se servono a più feature, vanno in `shared/components`.
- **models**: `*.model.ts`, solo tipi, interfacce e piccole funzioni pure collegate (es. `editionSeverity()`). Se un modello serve a più feature, vai in `core/models` (es. `ComicItem`).
- **services**: `*.service.ts`, `providedIn: 'root'`, con `inject()`. Se il servizio serve a più feature, vai in `core/services`.
- I test `*.spec.ts` stanno accanto al file che testano.

Per aggiungere una feature nuova:

1. Crea `features/<nome>/pages/<nome>-page/` (e le altre cartelle solo se servono).
2. Aggiungi il valore in `AppRoutes` (`core/models/app-routes.ts`) e la rotta in `app.routes.ts` (`loadComponent`, oppure `loadChildren` con `<nome>.routes.ts` se la feature ha più pagine).
3. Se è una pagina principale della navigazione mobile, aggiungila a `MAIN_PAGES` (`core/models/main-pages.ts`). Una sotto-pagina (es. `discover/ranking`) va come rotta figlia della pagina principale, così la voce di menu resta attiva.
4. Aggiungi i testi in `public/i18n/it.json` e `en.json`.

## Dove vanno le altre cose

- **core/models**: oltre ai tipi, le costanti di navigazione: `AppRoutes` (percorsi), `MAIN_PAGES` (ordine delle pagine principali) e `nav-item.model.ts`.
- **core/services**: servizi globali `*.service.ts` e funzioni di avvio `*.provider.ts` (`provideI18n()`, `provideNavDirection()`), registrate in `app.config.ts`.
- **core/interceptors**: interceptor HTTP funzionali (`*.interceptor.ts`). La cartella non esiste finché non serve il primo; un loader di dati (come quello di Transloco) non è un interceptor e sta in `services`.
- **core/layout**: shell dell'app (sidebar desktop, nav mobile, contenitore con lo swipe).
- **shared/components**: un componente per cartella, `<nome>.ts` + `<nome>.html` (es. `button/`, `tag/`).
- **shared/directives**: una cartella per direttiva, con l'eventuale logica pura separata e testabile (es. `swipe/swipe.directive.ts` + `swipe/detect-swipe.ts`).
