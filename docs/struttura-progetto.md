# Struttura del progetto

Albero delle cartelle e regole su dove mettere i file. Le regole essenziali sulle dipendenze sono anche in `CLAUDE.md`.

```
src/
├── app/
│   ├── app.config.ts          provider globali (router, Transloco, ...)
│   ├── app.routes.ts          monta le rotte di ogni feature sul suo percorso (loadChildren)
│   ├── core/                  parti singleton usate da tutta l'app, niente UI di feature
│   │   ├── guards/            user-role/ (user-role.guard + spec)
│   │   ├── interceptors/      interceptor HTTP (si crea con il primo interceptor)
│   │   ├── layout/            shell dell'app: sidebar desktop, nav mobile
│   │   └── providers/         provider di avvio, uno per cartella: core/ (provideCore), boot-skeleton/, i18n/, nav-direction/
│   ├── features/              una cartella per area funzionale
│   │   └── <feature>/         auth, comics, discover, library, not-found, profile, ranking, releases
│   │       ├── pages/         componenti collegati alle rotte (lazy)
│   │       ├── components/    componenti usati solo da questa feature
│   │       ├── models/        tipi e interfacce della feature
│   │       └── services/      servizi della feature (vedi "Dentro una feature")
│   └── shared/                riutilizzabile da più feature e da core, non dipende da features
│       ├── components/        componenti UI generici: app-tag, appButton, app-horizontal-scroller, app-empty-state, app-skeleton, ...
│       ├── constants/         costanti condivise, `*.const.ts` (app-routes, main-pages)
│       ├── directives/        direttive generiche: appSwipe, appInView
│       ├── models/            modelli condivisi (comic, ranking-entry, user-role, nav-item) e edition-severity/
│       └── services/          servizi condivisi, uno per cartella (weekly-ranking/, viewport/, mobile-swipe/, transloco-http-loader/)
├── testing/                   codice di supporto ai test, non fa parte dell'app: test-providers/ (Transloco finto), test-setup/ (polyfill di jsdom)
├── tailwind.css               tema Tailwind (@theme): colori primary/surface/neutral/violet, radius
├── styles.css                 entry degli stili globali
public/
├── i18n/                      traduzioni Transloco (it.json, en.json)
├── theme/                     theme.css (token, sfondo), glass.css (effetto glass), page-transition.css (transizione tra pagine)
└── fonts/
scripts/
├── check-specs.mjs            controllo degli spec mancanti, lanciato da `npm run lint`
└── ensure-deps.mjs            installa le dipendenze se sono cambiate, lanciato da solo prima di start, build, test, lint e knip
vitest-base.config.mts         opzioni di Vitest per i test (ripristino automatico di mock e globali)
knip.json                      configurazione di Knip (file, export e dipendenze inutilizzati), lanciato da `npm run knip`
.github/workflows/ci.yml       CI di GitHub Actions: lint, knip, build e test su push e pull request verso develop
```

Dove mettere le cose:

- **core**: `guards`, `interceptors`, `layout` e `providers`: la shell dell'app, che esiste una volta sola. Non importare codice da `features`.
- **features**: tutto ciò che appartiene a una sola area. Una feature non importa da un'altra: se due feature condividono qualcosa, spostalo in `shared` (componenti, direttive, modelli, servizi, costanti).
  - **Eccezione**: `userRoleGuard` (`core/guards`) importa `AuthService` da `features/auth`. La dipendenza è a senso unico: `auth` non importa da `core`.
  - **Eccezione**: i servizi di navigazione: per andare in un'altra feature si inietta il suo `<nome>-navigation.service` (`DiscoverNavigationService`, `ComicsNavigationService`, ...).
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
├── routes/
│   ├── auth.routes.ts               rotte della feature (AUTH_ROUTES), relative e lazy
│   └── auth.routes.spec.ts
├── services/
│   ├── auth/
│   │   ├── auth.service.ts          dati e logica della feature (signal + computed)
│   │   └── auth.service.spec.ts
│   └── auth-navigation/             solo le rotte della feature (vedi sotto)
│       ├── auth-navigation.service.ts
│       └── auth-navigation.service.spec.ts
└── utils/
    └── safe-return-url/
        ├── safe-return-url.ts       funzioni pure della feature
        └── safe-return-url.spec.ts
```

- **pages**: una cartella per pagina, collegata a una rotta in `routes/<nome>.routes.ts` della feature. Contiene solo composizione e stato della pagina; il markup ripetuto va in `components`.
- **components**: componenti della feature, un componente per cartella (`<nome>.ts` + `<nome>.html`, selector `app-<nome>`). Se servono a più feature, vanno in `shared/components`.
- **models**: `*.model.ts`, solo tipi, interfacce ed enum (senza codice da eseguire, quindi senza spec). Una funzione collegata (es. `editionSeverity()`) sta in un file a parte, con il suo spec. Se un modello serve a più feature, vai in `shared/models` (es. `ComicItem`).
- **routes**: `<nome>.routes.ts` (`export const NOME_ROUTES: Routes`): le rotte della feature, relative alla sua radice. In coppia con il servizio di navigazione.
- **services/<nome>-navigation**: il servizio di navigazione, uno per ogni feature (anche `not-found`, `releases`, `library` e `profile`), con **solo le rotte della propria feature**: percorsi per i template (`rankingNavigation.rankingLink`), metodi `goToXxx()` per il codice, `*UrlTree()` per i guard. Per andare in un'altra feature si inietta il suo servizio (è l'unico import ammesso tra feature). Pagine e componenti non scrivono percorsi né usano `Router`. Regole in `.claude/rules/angular.md`, sezione "Routing".
- **services**: `*.service.ts`, `providedIn: 'root'`, con `inject()`. Se il servizio serve a più feature, vai in `shared/services` (es. `WeeklyRankingService`).
- **utils**: funzioni pure della feature (`<nome>.ts`), senza Angular se possibile.
- **Una cartella per file**: ogni file `.ts` sta in una cartella propria insieme al suo `*.spec.ts` (regole in `.claude/rules/angular.md`, sezione "Cartelle", e `test.md`). Fanno eccezione i `*.model.ts`, `main.ts` e i file nella radice di `src/app`.

Per aggiungere una feature nuova:

1. Crea `features/<nome>/pages/<nome>-page/` e il servizio di navigazione `services/<nome>-navigation/` (le altre cartelle solo se servono).
2. Aggiungi il valore in `AppRoutes` (`shared/constants/app-routes/app-routes.const.ts`), le rotte della feature in `routes/<nome>.routes.ts` (relative, con `loadComponent`) e montale in `app.routes.ts` con `loadChildren`. Aggiungi i link del servizio di navigazione ai casi di `app.routes.spec.ts`.
3. Se è una pagina principale della navigazione mobile, aggiungila a `MAIN_PAGES` (`shared/constants/main-pages/main-pages.const.ts`). Una sotto-pagina (es. `discover/ranking`) va come rotta figlia della pagina principale, così la voce di menu resta attiva.
4. Aggiungi i testi in `public/i18n/it.json` e `en.json`.

## Dove vanno le altre cose

- **shared/constants**: costanti condivise, una cartella per costante con `.const.ts` (es. `app-routes/app-routes.const.ts` con i percorsi di tutte le rotte, `main-pages/main-pages.const.ts` con l'ordine delle pagine principali).
- **shared/models** e **shared/services**: modelli e servizi usati da più feature o da `core` (es. `ComicItem`, `UserRole`, `ViewportService`, `WeeklyRankingService`). Un servizio qui è un singleton, come tutti quelli `providedIn: 'root'`.
- **core/providers**: le funzioni di avvio `*.provider.ts` (`provideI18n()`, `provideNavDirection()`, `provideBootSkeleton()`). `provideCore()` le raccoglie e `app.config.ts` registra solo quella: un nuovo provider globale ha la sua cartella in `core/providers/` e si aggiunge in `core/providers/core/core.provider.ts`, non in `app.config.ts`. Il router resta in `app.config.ts`, con le sue opzioni.
- **core/interceptors**: interceptor HTTP funzionali (`*.interceptor.ts`), registrati con `provideHttpClient(withInterceptors([...]))` in `core/providers/core/core.provider.ts`. La cartella non esiste finché non serve il primo; un loader di dati (come quello di Transloco) non è un interceptor e sta in `shared/services`.
- **core/guards**: guard delle rotte (`*.guard.ts`).
- **core/layout**: shell dell'app (sidebar desktop, nav mobile, contenitore con lo swipe).
- **shared/components**: un componente per cartella, `<nome>.ts` + `<nome>.html` (es. `button/`, `tag/`, `empty-state/`).
- **shared/directives**: una cartella per direttiva, con l'eventuale logica pura separata e testabile (es. `swipe/swipe.directive.ts` e `swipe/detect-swipe/detect-swipe.ts`, ognuno col suo spec).
