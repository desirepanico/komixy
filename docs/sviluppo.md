# Sviluppo

## Comandi

| Comando | Cosa fa |
|---|---|
| `npm start` | Dev server su http://localhost:4200 |
| `npm run build` | Build di produzione |
| `npm test` | Tutti gli `*.spec.ts` di `src` con Vitest. In un terminale interattivo resta in watch; per una sola esecuzione `npm test -- --no-watch` (nelle sessioni di Claude Code è già una sola) |
| `npm run lint` | ESLint su `src` (configurazione in `eslint.config.js`) e `scripts/check-specs.mjs` (ogni file `.ts` deve avere il suo spec) |
| `npm run deploy:login` | Accesso a Vercel (una volta sola) |
| `npm run deploy:dev` | Preview su Vercel |
| `npm run deploy:prod` | Pubblicazione in produzione |

## Flusso git

- Le regole sui branch sono in `.claude/rules/git.md`: nessun branch nuovo di iniziativa, il nome lo sceglie l'utente.
- Messaggi di commit in italiano con prefisso `feat:`, `fix:`, `refactor:`, `test:` (solo test), `chore:`, `docs:`.
- Prima del push: `git pull --rebase origin develop`.
- Prima di ogni commit lancia `npm run lint`, `npm run build` e `npm test`.

## Test

Le regole (cosa testare, un file di spec per ogni file `.ts`, una cartella per file) sono in `.claude/rules/test.md` e `.claude/rules/angular.md`. Qui come funziona.

**Come girano.** `npm test` usa il builder `@angular/build:unit-test`: compila gli `*.spec.ts` come l'app (con gli stessi alias `@core`, `@shared`, `@features`) e li esegue con Vitest in un browser simulato (jsdom). Lo spec sta accanto al file, nella sua stessa cartella (`services/auth/auth.service.ts` → `services/auth/auth.service.spec.ts`).

**Cosa è già pronto in ogni test.** Le opzioni del builder in `angular.json` caricano tre cose, così gli spec non le ripetono:

| Opzione | File | Cosa fa |
|---|---|---|
| `providersFile` | `src/testing/test-providers/test-providers.ts` | Transloco finto con traduzioni vuote: nei test i testi che si leggono sono le chiavi (`'menu.main'`). `provideTranslocoTesting({ it: {...} })` dà traduzioni vere a un solo test |
| `setupFiles` | `src/testing/test-setup/test-setup.ts` | Aggiunge a jsdom `ResizeObserver`, `matchMedia` (sempre `false`) e `scrollBy`, che jsdom non ha |
| `runnerConfig` | `vitest-base.config.mts` | `restoreMocks` e `unstubGlobals`: dopo ogni test mock e variabili globali finte tornano come prima |

I file di `src/testing/` non fanno parte dell'app: `tsconfig.app.json` li esclude e `tsconfig.spec.json` li include.

**Il controllo.** `scripts/check-specs.mjs` gira dopo ESLint dentro `npm run lint` e controlla due cose in `src/`: che ogni file `.ts` abbia il suo `*.spec.ts` accanto, e che in ogni cartella ci sia un solo file con spec (la cartella propria del file). Se non è così, elenca i file e esce con errore. Salta gli spec, i `*.d.ts`, i `*.model.ts` (solo tipi ed enum, senza codice da eseguire), `main.ts` e i file nella radice di `src/app`. Un file con una funzione, anche se sta in una cartella `models`, ha bisogno dello spec: la funzione va in un file senza `.model`, nella sua cartella.

**Cosa c'è in uno spec.** `describe` con il nome della classe o della funzione, `it` con il comportamento in italiano. Un componente si crea con `TestBed.createComponent`; gli input si impostano con un componente `Host` di prova nel file (che prova anche i binding del template) o con `fixture.componentRef.setInput`. L'app è zoneless: dopo la creazione e dopo ogni azione che cambia un signal si fa `await fixture.whenStable()`, non `detectChanges()`.

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
- Disattivate di proposito: `component-selector` (i componenti shared usano selector ad attributo, es. `button[appButton]`), `prefer-ngsrc` (le copertine arrivano da URL esterni) e `no-host-metadata-property`.
- Ignorati: `dist/`, `.angular/`, `node_modules/`.

Dopo ESLint, `npm run lint` esegue `scripts/check-specs.mjs` (vedi sopra, sezione Test).

Quando una regola di `.claude/rules/angular.md` cambia, si aggiorna `eslint.config.js` nello stesso commit.

## Deploy

L'app è una single page app su Vercel. `vercel.json` definisce il comando di build, la cartella di output (`dist/komixy/browser`) e il rewrite di ogni percorso su `index.html`.

## Sicurezza

Non leggere né committare file con segreti (`.env*`, `environment.local.ts`, chiavi). I permessi sono in `.claude/settings.json`, le esclusioni in `.gitignore`.
