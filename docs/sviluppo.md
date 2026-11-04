# Sviluppo

## Comandi

| Comando | Cosa fa |
|---|---|
| `npm start` | Dev server (`ng serve`) su http://localhost:4200, si ricarica a ogni modifica |
| `npm run build` | Build di produzione (`ng build`) in `dist/komixy/browser`, usata anche da Vercel |
| `npm run watch` | Come `build` ma in modalità sviluppo e rilanciata a ogni modifica: controlla solo che compili, senza server |
| `npm test` | Tutti gli `*.spec.ts` di `src` con Vitest (`ng test`). In un terminale interattivo resta in watch; per una sola esecuzione `npm test -- --no-watch` (nelle sessioni di Claude Code è già una sola) |
| `npm run lint` | ESLint su `src` (configurazione in `eslint.config.js`) e `scripts/check-specs.mjs` (ogni file `.ts` deve avere il suo spec) |
| `npm run knip` | Cerca file, export e dipendenze inutilizzati (configurazione in `knip.json`, regole in `.claude/rules/knip.md`) |
| `npm run ng -- <comando>` | CLI di Angular, per esempio `npm run ng -- generate component ...` |
| `npm run deploy:login` | Accesso a Vercel (una volta sola) |
| `npm run deploy:dev` | Preview su Vercel (`npx vercel`): un indirizzo di prova con le modifiche locali, il sito pubblico non cambia |
| `npm run deploy:prod` | Pubblicazione in produzione su Vercel (`npx vercel --prod`): cambia il sito pubblico |

Gli script `prestart`, `prebuild`, `pretest`, `prelint` e `preknip` non si lanciano a mano: npm esegue automaticamente lo script con prefisso `pre` prima di quello con lo stesso nome. Tutti eseguono `scripts/ensure-deps.mjs` (sezione seguente).

## Installazione automatica delle dipendenze

Non serve lanciare `npm install` a mano dopo un `git pull`. Prima di `npm start`, `build`, `test`, `lint` e `knip` (script `pre*` in `package.json`) parte `scripts/ensure-deps.mjs`: confronta un'impronta di `package.json` e `package-lock.json` con quella salvata in `node_modules/.komixy-deps-hash` e, se è diversa o manca, esegue `npm install`. Se non è cambiato nulla esce subito. In CI (`CI` impostata) non fa nulla, perché le dipendenze arrivano da `npm ci`. Vale anche per le attività di VS Code e per Claude Code (hook `SessionStart` e modifica di `package.json`, vedi `docs/claude-code.md`).

## Flusso git

- Le regole sui branch sono in `.claude/rules/git.md`: si lavora su `develop`, nessun branch nuovo di iniziativa (il nome lo sceglie l'utente), `master` è la produzione e si aggiorna solo con una pull request da `develop`.
- Messaggi di commit in italiano con prefisso `feat:`, `fix:`, `refactor:`, `test:` (solo test), `chore:`, `docs:`.
- Prima del push: `git pull --rebase origin develop`.
- Prima di ogni commit lancia `npm run lint`, `npm run knip`, `npm run build` e `npm test`.

## Test

Le regole (cosa testare, un file di spec per ogni file `.ts`, una cartella per file) sono in `.claude/rules/test.md` e `.claude/rules/angular.md`. Qui come funziona.

**Come girano.** `npm test` usa il builder `@angular/build:unit-test`: compila gli `*.spec.ts` come l'app (con gli stessi alias `@core`, `@shared`, `@features`) e li esegue con Vitest in un browser simulato (jsdom). Lo spec sta accanto al file, nella sua stessa cartella (`services/auth/auth.service.ts` → `services/auth/auth.service.spec.ts`).

**Cosa è già pronto in ogni test.** Le opzioni del builder in `angular.json` caricano tre cose, così gli spec non le ripetono:

| Opzione | File | Cosa fa |
|---|---|---|
| `providersFile` | `src/testing/test-providers/test-providers.ts` | Transloco finto con traduzioni vuote: nei test i testi che si leggono sono le chiavi (`'menu.main'`). `provideTranslocoTesting({ it: {...} })` dà traduzioni vere a un solo test |
| `setupFiles` | `src/testing/test-setup/test-setup.ts` | Aggiunge a jsdom `ResizeObserver`, `matchMedia` (sempre `false`) e `scrollBy`, che jsdom non ha |
| `runnerConfig` | `vitest-base.config.mts` | `restoreMocks` e `unstubGlobals`: dopo ogni test mock e variabili globali finte tornano come prima |

**A cosa serve `src/testing/`.** jsdom simula il browser ma non lo replica del tutto: se un componente usa una funzione che jsdom non ha, il test si rompe con errori come "ResizeObserver is not defined". I finti in `src/testing/` sono scritti una volta sola e caricati prima di ogni test, così gli spec restano brevi. Le traduzioni sono finte perché il test controlla il comportamento del componente, non il testo italiano.

I file di `src/testing/` non fanno parte dell'app: `tsconfig.app.json` li esclude e `tsconfig.spec.json` li include.

**Il controllo.** `scripts/check-specs.mjs` gira dopo ESLint dentro `npm run lint` e controlla due cose in `src/`: che ogni file `.ts` abbia il suo `*.spec.ts` accanto, e che in ogni cartella ci sia un solo file con spec (la cartella propria del file). Se non è così, elenca i file e esce con errore. Salta gli spec, i `*.d.ts`, i `*.model.ts` (solo tipi ed enum, senza codice da eseguire), `main.ts` e i file nella radice di `src/app`. Un file con una funzione, anche se sta in una cartella `models`, ha bisogno dello spec: la funzione va in un file senza `.model`, nella sua cartella.

**Cosa c'è in uno spec.** La forma è quella degli spec che genera `ng generate` (i modelli stanno in `node_modules/@schematics/angular/*/files/*.spec.ts.template` e sono la fonte da guardare quando Angular cambia): per un componente `beforeEach` con `TestBed.configureTestingModule({ imports: [Componente] }).compileComponents()`, creazione del fixture, `await fixture.whenStable()` e un test "viene creato"; per un servizio `TestBed.inject(Servizio)`; per un guard `TestBed.runInInjectionContext(() => guard(...))`. Poi i test dei comportamenti: `describe` con il nome della classe o della funzione, `it` con il comportamento in italiano. Un componente si crea con `TestBed.createComponent`; gli input si impostano con un componente `Host` di prova nel file (che prova anche i binding del template) o con `fixture.componentRef.setInput`. L'app è zoneless: dopo la creazione e dopo ogni azione che cambia un signal si fa `await fixture.whenStable()`, non `detectChanges()`.

**Ricette ricorrenti**

| Serve | Come |
|---|---|
| `routerLink`, `Router` | `provideRouter([...rotte])`; per una pagina vera `RouterTestingHarness.create()` e `harness.navigateByUrl(...)` |
| Richieste HTTP | `provideHttpClient()` + `provideHttpClientTesting()`, `HttpTestingController.expectOne(...).flush(...)` e `http.verify()` alla fine |
| Codice di avvio (`provideXxx()`) | `providers: [provideXxx()]`, poi `await TestBed.inject(ApplicationInitStatus).donePromise` |
| Un servizio di cui non serve il codice vero | `{ provide: Servizio, useValue: { ... } }` con `vi.fn()` e signal di prova |
| Un'API del browser con un comportamento diverso (`matchMedia` vero, `IntersectionObserver`) | `vi.stubGlobal(...)` dentro il test |
| Un guard | `TestBed.runInInjectionContext(() => guard(...))` |

## Lint

`npm run lint` lancia ESLint 9 (angular-eslint + typescript-eslint) su `src`. La configurazione è nel file `eslint.config.js` in radice: è obbligatorio, senza di esso ESLint 9 non parte.

- `**/*.ts`: regole raccomandate di ESLint, TypeScript e Angular, più le regole di `.claude/rules/angular.md` (standalone, `OnPush` di default, `inject()`, niente `any`, `output` e signal readonly, `prefer-signals`, niente rinomina degli `input`).
- `**/*.html`: template raccomandati e `@if`/`@for` al posto delle direttive strutturali.
- Nelle feature `no-restricted-imports` vieta di importare da un'altra feature (tranne i servizi `<nome>-navigation` e la card della classifica per `discover`) e, in `pages` e `components`, anche `Router` e `AppRoutes`: la navigazione passa dai servizi di navigazione.
- Disattivate di proposito: `component-selector` (i componenti shared usano selector ad attributo, es. `button[appButton]`), `prefer-ngsrc` (le copertine arrivano da URL esterni) e `no-host-metadata-property`.
- Ignorati: `dist/`, `.angular/`, `node_modules/`.

Dopo ESLint, `npm run lint` esegue `scripts/check-specs.mjs` (vedi sopra, sezione Test).

Quando una regola di `.claude/rules/angular.md` cambia, si aggiorna `eslint.config.js` nello stesso commit.

## CI

CI (*Continuous Integration*) è un controllo automatico che GitHub esegue su un server pulito, senza il computer di chi sviluppa, ogni volta che si pubblica codice. Serve a verificare che il progetto funzioni anche fuori dalla propria macchina: per esempio prende un pacchetto dimenticato in `package.json` che in locale funziona perché era già installato.

`.github/workflows/ci.yml` gira su push e pull request verso `develop` e `master` (la pull request di rilascio `develop` → `master` è quindi controllata prima dell'unione). Su una macchina Linux con Node 22 esegue, in ordine:

1. `npm ci`: installa le dipendenze;
2. `npm run lint`;
3. `npm run knip`: fallisce se trova file, export o dipendenze inutilizzati (`knip.json`, regole in `.claude/rules/knip.md`);
4. `npm run build`;
5. `npm test -- --no-watch`.

Se un passaggio fallisce il commit è segnato con ❌, se passano tutti con ✅.

**`npm ci` e `npm install`.** `npm install` installa o aggiorna i pacchetti e può modificare `package-lock.json`: si usa in locale (lo lancia da solo `scripts/ensure-deps.mjs`, vedi sopra). `npm ci` cancella `node_modules` e installa esattamente le versioni di `package-lock.json` senza cambiarlo: è più lento ma riproducibile, quindi è quello giusto per la CI. GitHub imposta la variabile `CI`, e per questo `scripts/ensure-deps.mjs` in CI non fa nulla.

## Deploy

L'app è una single page app su Vercel (progetto `desirepanico-komixy`). `vercel.json` definisce il comando di build, la cartella di output (`dist/komixy/browser`) e il rewrite di ogni percorso su `index.html`.

**I deploy sono sempre manuali.** `vercel.json` ha `"git": { "deploymentEnabled": false }`: un `git push`, su qualsiasi ramo, non pubblica niente. Si pubblica solo lanciando un comando (o *Redeploy*/*Promote* dal pannello Vercel). Così nessun push cambia per sbaglio dev o produzione, e pubblicare in dev non tocca mai la produzione.

**Preview e produzione.** Vercel distingue due tipi di deployment:

- **Preview (dev)**: un indirizzo di prova, separato dal sito pubblico. Ogni deployment ha il suo indirizzo (`desirepanico-komixy-<codice>-<team>.vercel.app`).
- **Produzione**: il sito pubblico. Cambia solo con un deployment di produzione.

**Gli indirizzi del progetto.** Dev: `https://desirepanico-komixy-dev.vercel.app`. Produzione: `https://desirepanico-komixy.vercel.app`.

**I due rami.** `develop` è il ramo di lavoro e `master` la versione pubblicata. Non sono collegati a Vercel: a decidere cosa va in dev e in produzione è il comando che si lancia.

**Cosa pubblica cosa.**

| Azione | Risultato |
|---|---|
| `git push` (qualsiasi ramo) | Non pubblica. Parte solo la CI su GitHub |
| `npm run deploy:dev` | **Preview** dai file locali: mai la produzione |
| `npm run deploy:prod` | **Produzione** dai file locali |
| *Redeploy* o *Promote to Production* nel pannello Vercel | Rifà o mette in produzione un deployment già fatto (utile anche per tornare indietro) |

**Come si rilascia.**

1. Si lavora e si pusha su `develop`: la CI controlla il codice. Non si pubblica niente.
2. Per provare: da `develop`, pulito e aggiornato, `npm run deploy:dev`. L'indirizzo di dev è `https://desirepanico-komixy-dev.vercel.app`.
3. Quando va bene, su GitHub si apre una pull request da `develop` a `master` (la CI la controlla) e si unisce.
4. Da `master` aggiornato e pulito, `npm run deploy:prod`. Il sito pubblico è `https://desirepanico-komixy.vercel.app`.

**Comandi per pubblicare.** La prima volta su un PC: `npm run deploy:login` e, se Vercel lo chiede, collegare il progetto esistente `desirepanico-komixy` nel team `desy2`.

*Dev*:

```bash
git checkout develop
git pull --rebase origin develop
npm run deploy:dev
```

*Produzione* (dopo aver unito la pull request):

```bash
git checkout master
git pull origin master
git status
npm run deploy:prod
git checkout develop
```

`npm run deploy:*` pubblica i file della cartella in cui lo lanci, non il ramo remoto: per questo si lancia da `develop` (dev) o da `master` (produzione), con `git status` pulito. Se l'indirizzo `-dev` non si aggiorna dopo `deploy:dev`, si assegna a mano all'ultima preview: `npx vercel alias set <indirizzo-della-preview> desirepanico-komixy-dev.vercel.app`.

**Accesso.** Gli indirizzi `*.vercel.app` delle preview sono protetti (Vercel Authentication): chi li apre deve essere collegato a Vercel con un account del team.

## Sicurezza

Non leggere né committare file con segreti (`.env*`, `environment.local.ts`, chiavi). I permessi sono in `.claude/settings.json`, le esclusioni in `.gitignore`.
