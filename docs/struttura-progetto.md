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
│   │   └── providers/         provider di avvio: provideCore() (i18n, direzione delle transizioni)
│   ├── features/              una cartella per area funzionale
│   │   └── <feature>/         auth, comics, discover, not-found, ranking, releases
│   │       ├── pages/         componenti collegati alle rotte (lazy)
│   │       ├── components/    componenti usati solo da questa feature
│   │       ├── models/        tipi e interfacce della feature
│   │       └── services/      servizi della feature (vedi "Dentro una feature")
│   └── shared/                riutilizzabile da più feature e da core, non dipende da features
│       ├── components/        componenti UI generici: app-tag, appButton, app-horizontal-scroller, ...
│       ├── constants/         costanti condivise, `*.const.ts` (app-routes, main-pages)
│       ├── directives/        direttive generiche: appSwipe, appInView
│       ├── models/            modelli condivisi (comic, ranking-entry, user-role, nav-item, environment, edition-severity)
│       └── services/          servizi condivisi (weekly-ranking, viewport, mobile-swipe, loader Transloco)
├── tailwind.css               tema Tailwind (@theme): colori primary/surface/neutral/violet, radius
├── styles.css                 entry degli stili globali
public/
├── i18n/                      traduzioni Transloco (it.json, en.json)
├── theme/                     theme.css (token, sfondo), glass.css (effetto glass), page-transition.css (transizione tra pagine)
└── fonts/
```

Dove mettere le cose:

- **core**: `guards`, `interceptors`, `layout` e `providers`: la shell dell'app, che esiste una volta sola. Non importare codice da `features`.
- **features**: tutto ciò che appartiene a una sola area. Una feature non importa da un'altra: se due feature condividono qualcosa, spostalo in `shared` (componenti, direttive, modelli, servizi, costanti).
  - **Eccezione**: `userRoleGuard` (`core/guards`) importa `AuthService` da `features/auth`. La dipendenza è a senso unico: `auth` non importa da `core`.
  - **Eccezione**: `discover` mostra la Top 5 usando la card della feature `ranking` (`features/ranking/components`). La dipendenza è a senso unico: `ranking` non importa mai da `discover`.
- **shared**: componenti, direttive, modelli, servizi e costanti usati da più feature (o da `core`). Può essere importato da qualsiasi parte, ma non dipende da `features` né da `core`. Un servizio qui è un singleton come quelli di `core`: la differenza è che serve alle feature, non alla shell dell'app.
- Le dipendenze vanno in una direzione: `features` → `shared` e `core`; `shared` e `core` non dipendono da `features`, e `shared` non dipende da `core`.

## Dentro una feature

Si crea solo la cartella che serve. Esempio completo, la feature `auth` (modelli e servizi che servono solo a lei; quelli condivisi tra più feature vanno in `shared`):

```
features/auth/
├── pages/
│   └── login-page/
│       ├── login-page.ts            componente della rotta (lazy), orchestra la pagina
│       └── login-page.html
├── components/
│   └── login-form/                  componente usato solo da questa feature
│       ├── login-form.ts
│       └── login-form.html
├── models/
│   └── auth.model.ts                tipi e interfacce della feature (LoggedUser, LoginCredentials)
├── services/
│   └── auth.service.ts              dati e logica della feature (signal + computed)
└── utils/
    └── safe-return-url.ts           funzioni pure della feature, con il loro spec
```

- **pages**: una cartella per pagina, collegata a una rotta in `app.routes.ts` o nel `<nome>.routes.ts` della feature. Contiene solo composizione e stato della pagina; il markup ripetuto va in `components`.
- **components**: componenti della feature, un componente per cartella (`<nome>.ts` + `<nome>.html`, selector `app-<nome>`). Se servono a più feature, vanno in `shared/components`.
- **models**: `*.model.ts`, solo tipi, interfacce e piccole funzioni pure collegate (es. `editionSeverity()`). Se un modello serve a più feature, vai in `shared/models` (es. `ComicItem`).
- **services**: `*.service.ts`, `providedIn: 'root'`, con `inject()`. Se il servizio serve a più feature, vai in `shared/services` (es. `WeeklyRankingService`).
- I test `*.spec.ts` stanno accanto al file che testano.

Per aggiungere una feature nuova:

1. Crea `features/<nome>/pages/<nome>-page/` (e le altre cartelle solo se servono).
2. Aggiungi il valore in `AppRoutes` (`shared/constants/app-routes.const.ts`) e la rotta in `app.routes.ts` (`loadComponent`, oppure `loadChildren` con `<nome>.routes.ts` se la feature ha più pagine).
3. Se è una pagina principale della navigazione mobile, aggiungila a `MAIN_PAGES` (`shared/constants/main-pages.const.ts`). Una sotto-pagina (es. `discover/ranking`) va come rotta figlia della pagina principale, così la voce di menu resta attiva.
4. Aggiungi i testi in `public/i18n/it.json` e `en.json`.

## Dove vanno le altre cose

- **shared/constants**: costanti condivise, un file per costante con `.const.ts` (es. `app-routes.const.ts` con i percorsi di tutte le rotte, `main-pages.const.ts` con l'ordine delle pagine principali).
- **shared/models** e **shared/services**: modelli e servizi usati da più feature o da `core` (es. `ComicItem`, `UserRole`, `ViewportService`, `WeeklyRankingService`). Un servizio qui è un singleton, come tutti quelli `providedIn: 'root'`.
- **core/providers**: le funzioni di avvio `*.provider.ts` (`provideI18n()`, `provideNavDirection()`). `provideCore()` le raccoglie e `app.config.ts` registra solo quella: un nuovo provider globale si aggiunge in `core.provider.ts`, non in `app.config.ts`. Il router resta in `app.config.ts`, con le sue opzioni.
- **core/interceptors**: interceptor HTTP funzionali (`*.interceptor.ts`), registrati con `provideHttpClient(withInterceptors([...]))` in `core.provider.ts`. La cartella non esiste finché non serve il primo; un loader di dati (come quello di Transloco) non è un interceptor e sta in `shared/services`.
- **core/guards**: guard delle rotte (`*.guard.ts`).
- **core/layout**: shell dell'app (sidebar desktop, nav mobile, contenitore con lo swipe).
- **shared/components**: un componente per cartella, `<nome>.ts` + `<nome>.html` (es. `button/`, `tag/`).
- **shared/directives**: una cartella per direttiva, con l'eventuale logica pura separata e testabile (es. `swipe/swipe.directive.ts` + `swipe/detect-swipe.ts`).
