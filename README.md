# Komixy

App per collezionisti di fumetti e manga: scopri i volumi della settimana (la «busta» da aprire una volta a settimana), guarda la classifica, salva i fumetti nelle tue liste. Tema scuro viola, interfaccia in italiano.

Lo stato delle pagine (quali sono attive e quali ancora segnaposto) è in [`docs/funzionalita.md`](docs/funzionalita.md). I dati sono ancora simulati nei servizi, in attesa dell'API.

## Cosa serve per lavorare

| Cosa                            | Versione                   | Note                                                                                      |
| ------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------- |
| Node.js                         | 22 (quella usata dalla CI) | Vale anche per Vercel e per il computer di chi sviluppa                                   |
| npm                             | 11.7 (`packageManager`)    | Arriva con Node; `package-lock.json` è nel repository                                     |
| Git                             | qualsiasi recente          | Si lavora sul ramo `develop`                                                              |
| Account Vercel del team `desy2` | solo per pubblicare        | `npm run deploy:login` la prima volta (la CLI di Vercel parte con `npx`, non si installa) |
| Editor                          | VS Code consigliato        | Estensioni qui sotto                                                                      |

Estensioni di VS Code consigliate: Angular Language Service (`angular.ng-template`), Prettier (`esbenp.prettier-vscode`), i18n Ally (`lokalise.i18n-ally`, già configurata in `.vscode/settings.json` per `public/i18n`), Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`).

## Primi passi

```bash
git clone https://github.com/desirepanico/komixy.git
cd komixy
git checkout develop
npm install
npm start
```

L'app parte su http://localhost:4200. Dopo un `git pull` non serve rilanciare `npm install` a mano: prima di `start`, `build`, `test`, `lint` e `knip` lo script `scripts/ensure-deps.mjs` reinstalla se `package.json` o il lock sono cambiati.

## Comandi

| Comando                              | Cosa fa                                                                              |
| ------------------------------------ | ------------------------------------------------------------------------------------ |
| `npm start`                          | Dev server con ricarica automatica                                                   |
| `npm run build`                      | Build di produzione in `dist/komixy/browser`                                         |
| `npm test`                           | Test con Vitest (`npm test -- --no-watch` per una sola esecuzione)                   |
| `npm run lint`                       | ESLint e controllo che ogni file `.ts` abbia il suo spec                             |
| `npm run knip`                       | Cerca file, export e dipendenze inutilizzati                                         |
| `npx prettier --write <file>`        | Formatta un file (e ordina le classi Tailwind negli `.html`)                         |
| `npm run deploy:dev` / `deploy:prod` | Pubblica una preview / il sito su Vercel (sempre a mano, un `git push` non pubblica) |

Prima di un commit devono passare lint, knip, build e test: li esegue anche la CI di GitHub Actions. Tutti i dettagli (test, lint, CI, deploy) in [`docs/sviluppo.md`](docs/sviluppo.md).

## Cosa è installato

### Applicazione (`dependencies`)

| Pacchetto                                                                         | A cosa serve                                                                                 |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `@angular/core`, `common`, `compiler`, `forms`, `platform-browser`, `router` (22) | Il framework: componenti standalone, signal, router, Signal Forms (`@angular/forms/signals`) |
| `rxjs`, `tslib`                                                                   | Dipendenze richieste da Angular                                                              |
| `@jsverse/transloco`                                                              | Traduzioni (`public/i18n/it.json`, `en.json`)                                                |
| `@ng-icons/core`, `@ng-icons/material-symbols`                                    | Icone Material Symbols (`<ng-icon name="matXxxOutline" />`)                                  |
| `@ng-icons/simple-icons`                                                          | Loghi dei marchi (Google, Apple)                                                             |

Non ci sono librerie di componenti: PrimeNG è stato rimosso e non va reintrodotto. Si usano elementi HTML nativi con classi Tailwind.

### Strumenti di sviluppo (`devDependencies`)

| Pacchetto                                                               | A cosa serve                                                                                                                                                                                                                                           |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@angular/cli`, `@angular/build`, `@angular/compiler-cli`, `typescript` | Build, dev server e compilatore (`ng serve`, `ng build`, `ng test`)                                                                                                                                                                                    |
| `tailwindcss`, `@tailwindcss/postcss`, `postcss`                        | Tailwind CSS v4; il tema è in `src/tailwind.css`, il plugin PostCSS è in `.postcssrc.json`                                                                                                                                                             |
| `prettier`, `prettier-plugin-tailwindcss`                               | Formattazione del codice e ordine automatico delle classi Tailwind. Configurati nella chiave `prettier` di `package.json`: `tailwindStylesheet` punta a `src/tailwind.css` (necessario con Tailwind v4) e il plugin deve restare l'ultimo di `plugins` |
| `eslint`, `@eslint/js`, `typescript-eslint`, `angular-eslint`           | Lint (`eslint.config.js`): regole di Angular, divieti di import tra feature, niente `NgModule` né Reactive Forms                                                                                                                                       |
| `vitest`, `jsdom`                                                       | Test unitari in un browser simulato (`vitest-base.config.mts`, finti in `src/testing/`)                                                                                                                                                                |
| `knip`                                                                  | Individua codice e dipendenze inutilizzati (`knip.json`)                                                                                                                                                                                               |

### File di configurazione nella radice

| File                               | Cosa configura                                                         |
| ---------------------------------- | ---------------------------------------------------------------------- |
| `angular.json`, `tsconfig*.json`   | Progetto Angular, alias `@core/*`, `@shared/*`, `@features/*`, test    |
| `.postcssrc.json`                  | Plugin PostCSS di Tailwind                                             |
| `eslint.config.js`                 | ESLint                                                                 |
| `package.json` (chiave `prettier`) | Prettier con il plugin Tailwind                                        |
| `.editorconfig`                    | Indentazione a 2 spazi, apici singoli, fine riga                       |
| `knip.json`                        | Knip                                                                   |
| `vitest-base.config.mts`           | Ripristino automatico di mock e globali nei test                       |
| `vercel.json`                      | Build, cartella di output, rewrite a `index.html`, deploy solo manuali |
| `.github/workflows/ci.yml`         | CI: `npm ci`, lint, knip, build e test su push e pull request          |
| `.vscode/`                         | Estensioni consigliate, impostazioni dell'editor e di i18n Ally        |
| `scripts/`                         | `ensure-deps.mjs` (installa le dipendenze) e `check-specs.mjs` (spec)  |

### Claude Code

Il progetto è pensato per essere sviluppato anche con Claude Code. Tutto è nel repository, non si installa niente a parte:

- `CLAUDE.md`: istruzioni sempre caricate (comandi, struttura, convenzioni, flusso git);
- `.claude/rules/`: regole per argomento, caricate quando si toccano i file relativi;
- `.claude/hooks/` e `.claude/settings.json`: controlli automatici (ESLint e traduzioni dopo ogni modifica, lint, knip, build e test a fine turno) e permessi;
- `.claude/skills/` e `.claude/agents/`: skill `shared-component` e `use-shared`, revisore `reviewer`.

Dettagli in [`docs/claude-code.md`](docs/claude-code.md).

## Struttura in breve

```
src/app/core        shell dell'app: guard, layout, provider di avvio
src/app/features    una cartella per area: auth, comics, discover, library, not-found, pack, profile, ranking, releases
src/app/shared      componenti, direttive, modelli, servizi e costanti usati da più feature
src/testing         finti per i test (non fa parte dell'app)
public/             traduzioni (i18n), CSS globale (theme), font, immagini
```

## Documentazione

La cartella [`docs/`](docs/README.md) spiega come è fatto il progetto: parti da lì per capire di cosa si parla.

| Voglio...                                     | Leggo                                                                                                       |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Capire cosa fa l'app e a che punto è          | [`docs/funzionalita.md`](docs/funzionalita.md)                                                              |
| Capire come è organizzato il codice           | [`docs/architettura.md`](docs/architettura.md) e [`docs/struttura-progetto.md`](docs/struttura-progetto.md) |
| Lavorare con comandi, test, lint, CI e deploy | [`docs/sviluppo.md`](docs/sviluppo.md)                                                                      |
| Toccare stile e tema                          | [`docs/tema-e-stile.md`](docs/tema-e-stile.md)                                                              |
| Aggiungere o cambiare testi                   | [`docs/traduzioni.md`](docs/traduzioni.md)                                                                  |
| Capire come è configurato Claude Code         | [`docs/claude-code.md`](docs/claude-code.md)                                                                |
