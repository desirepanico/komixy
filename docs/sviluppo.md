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

Le regole (cosa testare, un file di spec per ogni file `.ts`) sono in `.claude/rules/test.md`. Qui come funziona.

**Come girano.** `npm test` usa il builder `@angular/build:unit-test`: compila gli `*.spec.ts` come l'app (con gli stessi alias `@core`, `@shared`, `@features`) e li esegue con Vitest in un browser simulato (jsdom). Lo spec sta accanto al file (`auth.service.ts` → `auth.service.spec.ts`) e il suo nome è il file più `.spec`.

**Il controllo.** `scripts/check-specs.mjs` gira dopo ESLint dentro `npm run lint`: cerca in `src/` i file `.ts` senza `*.spec.ts` accanto e, se ne trova, li elenca ed esce con errore. Salta gli spec, i `*.d.ts`, i `*.model.ts` (solo tipi ed enum, non hanno codice da eseguire) e `main.ts`. Un file con una funzione, anche se sta in una cartella `models`, ha bisogno dello spec: la funzione va in un file senza `.model`.

**Cosa c'è in uno spec.** `describe` con il nome della classe o della funzione, `it` con il comportamento in italiano. Un componente si testa con `TestBed.createComponent`: si impostano gli input (con un componente `Host` di prova nel file, oppure `fixture.componentRef.setInput`), si fa `fixture.detectChanges()` e, dopo ogni azione che cambia un signal, `await fixture.whenStable()` (l'app è zoneless: non c'è rilevamento automatico).

**Ricette ricorrenti**

| Serve | Come |
|---|---|
| Testi tradotti (`transloco`) | `TranslocoTestingModule.forRoot({ langs: { it: {} }, translocoConfig: { availableLangs: ['it'], defaultLang: 'it' } })`: i testi che si leggono sono le chiavi (`'menu.main'`) |
| `routerLink`, `Router` | `provideRouter([...rotte])`; per una pagina vera `RouterTestingHarness.create()` e `harness.navigateByUrl(...)` |
| Richieste HTTP | `provideHttpClient()` + `provideHttpClientTesting()`, poi `HttpTestingController.expectOne(...).flush(...)` |
| Codice di avvio (`provideXxx()`) | `providers: [provideXxx()]`, poi `await TestBed.inject(ApplicationInitStatus).donePromise` |
| Un servizio di cui non serve il codice vero | `{ provide: Servizio, useValue: { ... } }` con `vi.fn()` e signal di prova |
| API che jsdom non ha (`ResizeObserver`, `IntersectionObserver`, `matchMedia`, `scrollBy`) | `vi.stubGlobal(...)` nel test, `vi.unstubAllGlobals()` dopo |
| Un guard | `TestBed.runInInjectionContext(() => guard(...))` |

Ogni spec imposta da sé il suo `TestBed`: non ci sono helper condivisi, perché anche un helper `.ts` avrebbe bisogno del suo spec.

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
