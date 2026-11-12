# Komixy

App per collezionisti di fumetti/manga. Angular 22 (standalone, signals, zoneless, `OnPush` di default), Tailwind CSS v4 con tema scuro viola, Transloco per i testi, test con Vitest (jsdom), deploy manuale su Vercel. Lingua dell'interfaccia: italiano (`it`), con `en.json` tenuto allineato.

Questo file viene sempre caricato e basta da solo: non serve aprire altro per lavorare. Le regole di dettaglio sono anche in `.claude/rules/`, che si caricano da sole quando tocchi i file a cui si riferiscono (`paths:`); qui sono riassunte.

## Comandi

- `npm start`: dev server su http://localhost:4200
- `npm run build`: build di produzione
- `npm test`: Vitest. In un terminale interattivo resta in watch; per una sola esecuzione `npm test -- --no-watch` (nelle sessioni di Claude Code è già una sola)
- `npm run lint`: ESLint (angular-eslint) e `scripts/check-specs.mjs` (ogni `.ts` ha il suo spec, in una cartella propria)
- `npm run knip`: file, export e dipendenze inutilizzati (config in `knip.json`); gira anche in CI
- `npx prettier --write <file>`: formatta. La config è in `package.json` (larghezza 100, apici singoli, parser `angular` per gli `.html`) e `prettier-plugin-tailwindcss` ordina le classi Tailwind leggendo `src/tailwind.css`; il plugin deve restare l'ultimo di `plugins`
- `npm run deploy:login | deploy:dev | deploy:prod`: Vercel. I deploy sono sempre manuali (un `git push` non pubblica). `deploy:dev` fa una preview, `deploy:prod` pubblica il sito e si lancia solo da `master` pulito e aggiornato

Non serve `npm install` a mano: gli script `pre*` lanciano `scripts/ensure-deps.mjs`, che reinstalla se `package.json` o il lock sono cambiati.

## Struttura di `src/app`

- **core**: shell dell'app. `guards`, `interceptors` (non esiste finché non serve), `layout` (sidebar desktop, barra mobile), `providers` (funzioni `provideXxx()` di avvio, raccolte da `provideCore()` in `app.config.ts`). Non importa da `features`; unica eccezione, a senso unico: `userRoleGuard` usa `AuthService`.
- **features**: una cartella per area (`auth`, `comics`, `discover`, `library`, `not-found`, `pack`, `profile`, `ranking`, `releases`), con solo le sottocartelle che servono: `pages/`, `components/`, `models/`, `services/`, `routes/`, `utils/`. Una feature non importa da un'altra; unica eccezione, a senso unico: i servizi `<nome>-navigation` (e la card di `ranking` usata da `discover`).
- **shared**: ciò che serve a più feature o a `core`: `components`, `directives`, `models`, `services`, `constants`. Non dipende da `features` né da `core`. Se due feature condividono qualcosa, va qui (es. `WeeklyRankingService`, `WeeklyPackService`, `BookmarksService`, `SessionService`, `ComicCatalogService`, `app-pack-card`, `app-card-fan`).
- `src/testing/`: finti per i test (Transloco con chiavi al posto dei testi, polyfill di jsdom). Non fa parte dell'app.

Altro fuori da `src/app`: `public/i18n/` (traduzioni), `public/theme/` (CSS globale: token, sfondo, glass, transizione di pagina, autofill), `src/tailwind.css` (tema `@theme`), `scripts/` (controlli), `.github/workflows/ci.yml`, `vercel.json`.

Dipendenze in una direzione: `features` → `shared` e `core`. Import: alias `@core/*`, `@shared/*`, `@features/*` per attraversare le aree, percorsi relativi dentro la stessa area; mai `../../../`.

### Routing e navigazione

- `app.routes.ts` monta ogni feature con `loadChildren`; le rotte della feature stanno in `routes/<nome>.routes.ts`, relative e lazy (`loadComponent`), senza il percorso della feature.
- Ogni feature ha `services/<nome>-navigation/` con **solo le sue rotte**: percorsi per `[routerLink]` (i link restano `<a>`), metodi `goToXxx()` per il codice, `*UrlTree()` per i guard; percorsi assoluti. Per andare in un'altra feature si inietta il suo servizio di navigazione. Pagine e componenti non importano `Router` né `AppRoutes` (lo controlla ESLint). Il layout di `core` costruisce il menu con `AppRoutes` e `MAIN_PAGES`.
- `/` rimanda a `login`. L'apertura della busta (`discover/pack`) è a schermo intero, montata prima del layout. `discover/ranking` è figlia di `discover`, così la voce di menu resta attiva.

### Aggiungere una feature

1. `features/<nome>/pages/<nome>-page/` e `services/<nome>-navigation/` (le altre cartelle solo se servono).
2. Valore in `AppRoutes` (`shared/models/app-routes.model.ts`), rotte in `routes/<nome>.routes.ts`, montaggio in `app.routes.ts`, link del servizio di navigazione in `app.routes.spec.ts`.
3. Pagina principale della navigazione mobile: aggiungila a `MAIN_PAGES` (`shared/constants/navigation.const.ts`, usata da nav mobile, swipe e transizioni). Una sotto-pagina va come rotta figlia.
4. Testi in `public/i18n/it.json` e `en.json`.

## Pagine e funzionalità

| Pagina | Rotta | Feature | Stato |
|---|---|---|---|
| Login | `/login` (pagina di partenza), `/login/register`, `/login/forgot-password` | `auth` | Login attiva, fuori dal layout: da 1024px due colonne (`app-login-volumes` a sinistra, form in card a destra), sotto una colonna; alta quanto la finestra, senza scroll. Registrazione e password dimenticata: segnaposto |
| Scopri | `/discover` | `discover` | Attiva: busta della settimana (`app-weekly-pack-banner`) e «Manga da scoprire» (card con segnalibro) |
| Apertura busta | `/discover/pack` | `pack` | Attiva, a schermo intero, senza menu. Si strappa trascinando il lembo (`app-pack-tear`; alternativa «Apri la busta»), si girano le 10 carte dalla 10ª alla 1ª, poi raccolta a ventaglio |
| Classifica | `/discover/ranking` | `ranking` | Attiva: vista Elenco (default) o Carte (ventaglio), scelta nell'indirizzo (`?view=cards`, parametro `RANKING_VIEW_QUERY_PARAM`; l'elenco non ha parametro); a busta sigillata mostra `app-ranking-locked` |
| Fumetto | `/comic`, `/comic/:id` | `comics` | `/comic` segnaposto; `/comic/:id` dettaglio del volume («Fumetto non trovato» se l'id non esiste) |
| Uscite, Libreria, Profilo | `/releases`, `/library`, `/profile` | omonime | Segnaposto (`app-empty-state`) |
| Scan | `/scan` | — | Solo nell'enum `AppRoutes`, non implementata |
| Non trovata | qualsiasi altra | `not-found` | Pagina 404 |

Aggiorna questa tabella quando una pagina cambia stato.

## Dominio e dati

- **Ospiti e iscritti**: `SessionService` (impostato da `AuthService`) dice chi usa l'app. Un ospite può aprire la busta, vedere classifica e dettagli, ma non salvare nelle liste: i segnalibri hanno il lucchetto, `BookmarksService.toggle()` non salva e mostra un toast.
- **Busta settimanale**: `WeeklyPackService`. Le 10 carte sono la classifica della settimana (nessuna casualità); una apertura a settimana ISO (fuso `WEEKLY_PACK_TIME_ZONE`), registrata allo strappo. **Provvisorio**: per ora l'apertura è salvata solo nel browser (`localStorage`, chiave `komixy.weeklyPack`), uguale per ospiti e iscritti. A regime la gestisce il backend, sia per l'ospite (`guest_id` anonimo) sia per l'iscritto (`user_id`): lo stato della busta (sigillata o aperta) e l'apertura arrivano dal server, e `localStorage` non è più la fonte (vedi i `TODO` qui sotto). Una carta è «rara» se ha un'edizione speciale. Una busta già aperta rimanda alla classifica.
- **Dati simulati**: classifica, catalogo e segnalibri (in memoria) sono finti nei servizi, con `TODO` per l'API: apertura per identità (`user_id` o `guest_id`, una a settimana), `GET /weekly-pack`, `POST /weekly-pack/open` idempotente, classifica negata a busta sigillata, `PUT/DELETE /me/bookmarks/:comicId` con 403 per gli ospiti.
- **Componenti shared principali**: `app-tag`, `appButton` (varianti `filled`/`outlined`/`text`, severity `primary`…`accent`), `appToggleButton`, `app-field-wrapper` e `app-input-text`/`app-input-password`, `app-horizontal-scroller`, `app-bookmark-button`, `app-pack-card`/`app-card-fan`/`app-card-spotlight`, `app-brand`, `app-toast` con `ToastService`, `app-hint`, `app-select-button`, `app-message`, `app-skeleton`, `app-empty-state`; direttive `appSwipe` e `appInView`. Guarda `shared/components/` prima di scrivere markup nuovo.
- **Layout**: desktop con sidebar, mobile con barra in basso e swipe tra le pagine principali; la transizione tra pagine (view transition, solo sotto 1024px) legge `data-nav-direction` su `<html>`.

## Tema

- `src/tailwind.css`: `@theme` con colori `primary-*`, `surface-*`, `neutral-*`, `violet-*`, raggi `--radius-*`, font Mulish, animazioni (`animate-rank-in`, `animate-float`, `animate-pack-float`…) e breakpoint `xs` (360px).
- `public/theme/` è CSS globale, un argomento per file: `theme.css` (token, sfondo, focus ring), `glass.css`, `page-transition.css`, `autofill.css`. Un file nuovo va importato in `src/styles.css` prima di `./tailwind.css`, altrimenti non ha effetto. Con `prefers-reduced-motion` le animazioni di pagina sono disattivate.

## Provider e avvio

Ogni `provideXxx()` restituisce `EnvironmentProviders` e sta in `core/providers/<nome>/<nome>.provider.ts`: `provideI18n()` (Transloco, lingua `it`, carica le traduzioni prima dell'avvio; `src/index.html` ne fa il `preload`), `provideNavDirection()`, `provideBootSkeleton()` (toglie lo skeleton di `index.html` dopo la prima navigazione). Un nuovo provider globale si aggiunge a `provideCore()`, non ad `app.config.ts`, che tiene solo il router e `provideCore()`. Un servizio non ha bisogno di provider (`providedIn: 'root'`).

## Convenzioni di codice

- **Cartelle**: ogni `.ts` sta in una cartella propria con il suo `*.spec.ts` (e `.html` se è un componente), nominata come il file senza il tipo (`services/viewport/viewport.service.ts`). Eccezioni: `*.model.ts`, `*.const.ts`, `main.ts` e i file nella radice di `src/app`.
- **Nomi**: file in kebab-case col tipo (`auth.service.ts`, `user-role.guard.ts`, `i18n.provider.ts`); componenti e pagine senza `.component` (`comic-card.ts`, `discover-page.ts`); selector `app-nome` o `[appNome]`. Identificatori (variabili, parametri, funzioni) in inglese; commenti e testi di commit in italiano.
- **Componenti**: standalone senza scrivere `standalone: true`, template in un `.html` accanto, `host` nel decorator (niente `@HostBinding`/`@HostListener`), `class`/`style` binding (niente `ngClass`/`ngStyle`), control flow `@if/@for/@switch`, niente funzioni freccia o globali nei template, `NgOptimizedImage` per le immagini statiche.
- **Signal**: `signal()`, `computed()`, `linkedSignal()`, `input()`/`output()`/`model()`, `viewChild()`; tutti `readonly` e col tipo scritto (`signal<number>(0)`). Mai `@Input`/`@Output`/`mutate`. `effect()` solo per DOM, storage o log. Un servizio espone i signal con `asReadonly()`. Membri usati solo nel template: `protected`.
- **Servizi**: `providedIn: 'root'`, `inject()`, una responsabilità. Provider globali come `provideXxx()` in `core/providers`; niente `NgModule`.
- **TypeScript**: strict, niente `any` (usa `unknown`).
- **Costanti**: ogni `const` dichiarata sta in `shared/constants`, in tre soli file per ambito (`navigation.const.ts`, `ui.const.ts`, `form.const.ts`), in `UPPER_SNAKE_CASE`, senza sottocartelle né funzioni. Gli enum e i tipi stanno in un `*.model.ts` (es. `AppRoutes`).
- **Form**: Signal Forms (`@angular/forms/signals`), mai `FormBuilder`, `ReactiveFormsModule`, `ngModel`. Ogni campo usa un controllo di `shared/components/input/` (label e placeholder Transloco, `app-field-wrapper`, messaggi in `validation.*` scelti con `VALIDATION_MESSAGES`).
- **Stile**: Tailwind nel template, niente CSS globale per i componenti. Prima i token del tema (`primary-*`, `surface-*`, `neutral-*`, `violet-*`, `rounded-*`), poi la scala di Tailwind; valore arbitrario solo se serve in un punto solo. Se il valore torna in più punti, diventa un token in `@theme`. Effetto glass in `public/theme/glass.css`.
- **Riuso**: se lo stesso markup compare, o sta per comparire, due volte, estrailo in `shared/components` con la skill `shared-component`. Liste che scorrono in orizzontale: sempre `app-horizontal-scroller`, e le zone che scorrono in orizzontale hanno `data-no-swipe`. Contenuti in ritardo: `app-skeleton` con le stesse misure del contenuto vero.
- **PrimeNG è stato rimosso**: non reintrodurlo; HTML nativo + Tailwind. Icone: `@ng-icons/material-symbols` (`<ng-icon name="matXxxOutline" />`, registrate con `provideIcons` nel componente), loghi di marchi con `@ng-icons/simple-icons`.
- **Commenti**: solo dove il codice non basta, spiegano il perché (workaround, vincoli del browser, regole di business); un `TODO` dice cosa manca; mai codice commentato; brevi JSDoc sui componenti di `shared`.
- **Codice inutilizzato**: se Knip segnala qualcosa, lo si toglie (file con spec e html, export, dipendenza). Non si nasconde con `ignore` in `knip.json`. Knip non vede i membri di classe mai usati: cercali a mano.

## Traduzioni

- Transloco, file `public/i18n/it.json` e `en.json` con le **stesse chiavi**; mai valori vuoti. Un controllo automatico (`.claude/hooks/check-i18n.mjs`) gira dopo ogni modifica ai file.
- Nessun testo hardcoded in template e `.ts`, nemmeno `aria-label`, `alt`, `title`, `placeholder`. Chiavi in `camelCase` raggruppate per componente o feature (`mangaCard.coverAlt`); testi ripetuti in `common`; valori variabili con i parametri (`{{ title }}`), mai concatenazioni. Togli le chiavi non più usate.

## Accessibilità

- WCAG AA, contrasto minimo 4,5 a 1 (3 a 1 per testo grande e icone). Testo secondario: almeno `surface-500` su `surface-900`/`surface-950`, `surface-400` o più chiaro su sfondi più chiari.
- Ogni elemento interattivo ha un `focus-visible` ben visibile; bottoni con sola icona hanno `aria-label` tradotto; navigare = `<a routerLink>`, agire = `<button>`; mai `<div>` cliccabili.
- Tutto ciò che si fa con mouse o touch si fa anche da tastiera (nessuna funzione solo hover/swipe/drag). Una card cliccabile ha un solo `<a>` stirato con `after:absolute after:inset-0`. Gli errori di form hanno testo e icona, `aria-invalid` e `aria-describedby`.

## Test e lint

- Ogni `.ts` ha il suo `*.spec.ts` (lo controlla `npm run lint`). Componenti: `TestBed.configureTestingModule({ imports: [Componente] }).compileComponents()`, un test «viene creato» e poi ciò che mostrano (testi come chiavi Transloco, link, ARIA). Servizi, guard, funzioni pure e `computed()`: un test per ogni comportamento. Il `describe` ha il nome della classe, gli `it` descrivono il comportamento in italiano.
- App zoneless: dopo ogni azione `await fixture.whenStable()`, mai `fixture.detectChanges()`. Input con un `Host` di prova o `fixture.componentRef.setInput`. Provider standalone, niente `NgModule`.
- Già pronto in ogni test (da `angular.json`): Transloco finto con traduzioni vuote (`providersFile`: si leggono le chiavi; `provideTranslocoTesting` dà testi veri a un test), polyfill di jsdom per `ResizeObserver`, `matchMedia`, `scrollBy` (`setupFiles`), ripristino automatico di mock e globali (`vitest-base.config.mts`).
- Ricette: router `provideRouter([...])` o `RouterTestingHarness`; HTTP `provideHttpClient()` + `provideHttpClientTesting()` e `HttpTestingController`; provider di avvio con `TestBed.inject(ApplicationInitStatus).donePromise`; guard con `TestBed.runInInjectionContext`; API del browser diverse con `vi.stubGlobal`.
- Nei template `.html` `eslint-plugin-better-tailwindcss` segnala classi in conflitto, sconosciute, deprecate o non canoniche (con `npx eslint --fix` si correggono; l'ordine lo fa Prettier). Non concatenare stringhe di classi: classe statica più `[class]` a parte.
- ESLint vieta: import tra feature (tranne `*-navigation`), `Router` e `AppRoutes` in pagine e componenti, `@angular/forms` (solo Signal Forms), `CommonModule`/`NgClass`/`NgStyle`. Se cambi una regola di `angular.md`, aggiorna `eslint.config.js` nello stesso commit.

## Flusso git

- Commit e push solo su `develop`. Se l'ambiente assegna un altro branch (es. `claude/...`), fermati e chiedi. Non creare branch di tua iniziativa: il nome lo sceglie l'utente. `master` è la versione pubblicata e si aggiorna solo con una pull request da `develop` decisa dall'utente.
- **Prima di ogni commit e push chiedi conferma e aspetta l'ok esplicito**; non lanciare mai `npm run deploy:*` di iniziativa.
- Prima del commit lancia `npm run lint`, `npm run knip`, `npm run build` e `npm test`; prima del push `git pull --rebase origin develop`.
- Messaggi in italiano con prefisso `feat:`, `fix:`, `refactor:`, `test:`, `chore:`, `docs:`.
- **Rilascio**: `develop` è il ramo di lavoro, `master` la versione pubblicata (nessuno dei due è collegato a Vercel). Provare: da `develop` pulito `npm run deploy:dev` (https://desirepanico-komixy-dev.vercel.app). Pubblicare: pull request `develop` → `master` unita dall'utente, poi da `master` aggiornato e pulito `npm run deploy:prod` (https://desirepanico-komixy.vercel.app). `deploy:*` pubblica i file locali, non il ramo remoto. Quando l'utente vuole pubblicare, chiedi prima se unire `develop` in `master`, e fai ogni passo solo dopo il suo sì.
- La CI (GitHub Actions, Node 22) su push e pull request verso `develop` e `master` esegue `npm ci`, lint, knip, build e test.

## Claude Code in questo progetto

- **Hook** (`.claude/settings.json`): all'avvio installa le dipendenze se servono; dopo ogni Edit/Write lancia ESLint sul file, controlla le traduzioni e ricorda lo spec mancante; a fine turno, se hai toccato `src/`, traduzioni, `scripts/` o configurazione, lancia lint, knip, build e test e ti rimanda a correggere se falliscono.
- **Permessi**: i file con segreti (`.env*`, `environment.local.ts`, chiavi) non si leggono né si committano; `git push` e `deploy:*` chiedono conferma; push forzati e creazione di branch sono negati.
- **Skill**: `shared-component` (crea o modifica un componente in `shared/components`), `use-shared <nome>` (inserisce un componente shared esistente).
- **Subagent** `reviewer`: revisore a sola lettura da invocare a lavoro finito, prima del commit, passandogli i file modificati: controlla bug, regole del progetto, accessibilità, traduzioni, test e confini tra aree.
- Non scrivere chiavi, token o password nei file del repo né in chat.

## Documentazione

`README.md` e `docs/` sono per le persone e ripetono in forma estesa ciò che trovi qui; non serve leggerli. Se la tua modifica cambia struttura, rotte, funzionalità, hook, comandi, strumenti o dipendenze, aggiornali nello stesso commit insieme a questo file (pagine in `docs/funzionalita.md`, comandi in `docs/sviluppo.md`, strumenti nel `README.md`) e togli ciò che non esiste più. Le regole non si scrivono lì: stanno qui o in `.claude/rules/`.
