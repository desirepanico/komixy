# Sviluppo

## Comandi

| Comando | Cosa fa |
|---|---|
| `npm start` | Dev server su http://localhost:4200 |
| `npm run build` | Build di produzione |
| `npm test` | Test con Vitest (una sola esecuzione) |
| `npm run lint` | ESLint su `src` (configurazione in `eslint.config.js`) e controllo che ogni file `.ts` abbia il suo spec (`scripts/check-specs.mjs`) |
| `npm run deploy:login` | Accesso a Vercel (una volta sola) |
| `npm run deploy:dev` | Preview su Vercel |
| `npm run deploy:prod` | Pubblicazione in produzione |

## Flusso git

- Le regole sui branch sono in `.claude/rules/git.md`: nessun branch nuovo di iniziativa, il nome lo sceglie l'utente.
- Messaggi di commit in italiano con prefisso `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`.
- Prima del push: `git pull --rebase origin develop`.
- Prima di ogni commit lancia `npm run build` e `npm test`; prima di consegnare anche `npm run lint`.

## Test

Regole in `.claude/rules/test.md`: si testano servizi, guard, `computed()` con logica di business e funzioni pure. Il file `*.spec.ts` sta accanto al file testato.

## Lint

`npm run lint` lancia ESLint 9 (angular-eslint + typescript-eslint) su `src`. La configurazione è nel file `eslint.config.js` in radice: è obbligatorio, senza di esso ESLint 9 non parte.

- `**/*.ts`: regole raccomandate di ESLint, TypeScript e Angular, più le regole di `.claude/rules/angular.md` (standalone, `OnPush` di default, `inject()`, niente `any`, `output` e signal readonly, `prefer-signals`, niente rinomina degli `input`).
- `**/*.html`: template raccomandati e `@if`/`@for` al posto delle direttive strutturali.
- Disattivate di proposito: `component-selector` (i componenti shared usano selector ad attributo, es. `button[appButton]`), `prefer-ngsrc` (le copertine arrivano da URL esterni) e `no-host-metadata-property`.
- Ignorati: `dist/`, `.angular/`, `node_modules/`.

Dopo ESLint, `npm run lint` esegue `scripts/check-specs.mjs`: elenca i file `.ts` di `src/` senza `*.spec.ts` accanto (esclusi i `*.model.ts` e `main.ts`) ed esce con errore. La regola è in `.claude/rules/test.md`.

Quando una regola di `.claude/rules/angular.md` cambia, si aggiorna `eslint.config.js` nello stesso commit.

## Deploy

L'app è una single page app su Vercel. `vercel.json` definisce il comando di build, la cartella di output (`dist/komixy/browser`) e il rewrite di ogni percorso su `index.html`.

## Sicurezza

Non leggere né committare file con segreti (`.env*`, `environment.local.ts`, chiavi). I permessi sono in `.claude/settings.json`, le esclusioni in `.gitignore`.
