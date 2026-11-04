# Komixy

App Angular 22 (standalone, signals) per collezionisti di fumetti/manga. Stile: Tailwind CSS v4, tema scuro viola (`primary-*` / `surface-*` definiti in `src/tailwind.css`), effetto "glass" in `public/theme/glass.css`.

Le regole dettagliate sono in `.claude/rules/` (Angular, stile, accessibilità, test, i18n, git). La documentazione del progetto è in `docs/` (indice in `docs/README.md`): non è caricata in automatico, quindi aprila tu quando il compito la riguarda. Questo file contiene solo l'essenziale.

## Documentazione (`docs/`)

Prima di toccare questi temi, leggi il file relativo:

- Struttura cartelle, nuova feature, dipendenze tra aree: `docs/architettura.md` e `docs/struttura-progetto.md`
- Pagine, funzionalità, stato di avanzamento: `docs/funzionalita.md`
- Tailwind, token del tema, effetto glass: `docs/tema-e-stile.md`
- Testi e traduzioni: `docs/traduzioni.md`
- Comandi, test, lint, deploy: `docs/sviluppo.md`
- Rules, hooks, skills, permessi di Claude Code: `docs/claude-code.md`

Se la modifica cambia struttura, rotte, funzionalità, hook o comandi, aggiorna il file di `docs/` corrispondente nello stesso commit. Una regola si scrive in un solo posto: se esiste già in `.claude/rules/`, in `docs/` si rimanda senza ripeterla.

## Comandi

- `npm start` — dev server su http://localhost:4200
- `npm run build` — build di produzione
- `npm test` — test con Vitest
- `npm run lint` — ESLint (angular-eslint): fa rispettare le regole di `.claude/rules/angular.md`
- `npm run deploy:login` — accesso a Vercel (da fare una volta sola)
- `npm run deploy:dev` — pubblica una preview su Vercel (usa `vercel.json`)
- `npm run deploy:prod` — pubblica in produzione su Vercel (indirizzo pubblico del progetto)

## Struttura

Albero completo delle cartelle ed esempio di feature in `docs/struttura-progetto.md`. In breve, `src/app` ha tre aree:

- **core**: auth, guard, i18n, layout, navigazione, modelli e servizi globali. Non importa da `features`.
- **features**: una cartella per area (`pages/`, `components/`, `models/`, `services/`, solo quelle che servono). Una feature non importa da un'altra. Eccezione: `discover` usa card e servizio di `ranking`, a senso unico.
- **shared**: componenti e direttive generici, senza logica di business. Non dipende da `features`.

Import: alias `@core/*`, `@shared/*`, `@features/*` per attraversare le aree; percorsi relativi dentro la stessa area o feature. Le dipendenze vanno in una direzione: `features` → `shared` e `core`. Se due feature condividono qualcosa, spostalo in `shared` (componenti) o in `core` (modelli e servizi). I test `*.spec.ts` stanno accanto al file testato. Nuovi componenti riutilizzabili: skill `shared-component`.

Per aggiungere una feature nuova:

1. Crea `features/<nome>/pages/<nome>-page/`.
2. Aggiungi il valore in `AppRoutes` (`core/navigation/app-routes.ts`) e la rotta in `app.routes.ts`: `loadComponent` per una pagina sola, `loadChildren` con un file `<nome>.routes.ts` nella feature se ne ha più di una.
3. Se è una pagina principale della navigazione mobile, aggiungila a `MAIN_PAGES` (`core/navigation/main-pages.ts`). Una sotto-pagina (es. `discover/ranking`) va come rotta figlia, così la voce di menu resta attiva.
4. Aggiungi i testi in `public/i18n/it.json` e `en.json`.

## Convenzioni

- **PrimeNG è stato rimosso**: non reintrodurlo. Usa elementi HTML nativi + classi Tailwind.
- Icone: `@ng-icons/material-symbols` (`<ng-icon name="matXxxOutline" />`, registrate in `provideIcons`).
- Traduzioni: Transloco, file in `public/i18n/` (lingua `it`). Regole in `.claude/rules/i18n.md`.
- Commenti nel codice e messaggi di commit in italiano.
- Swipe tra pagine: la lista delle pagine principali è `MAIN_PAGES` in `core/navigation/main-pages.ts` (usata da nav mobile, swipe e transizioni). Le zone che scorrono in orizzontale devono avere `data-no-swipe`.

## Flusso git

- Regole sui branch in `.claude/rules/git.md`. Prima del commit lancia tu `npm run build` e `npm test`.
- Prima del push fai `git pull --rebase origin develop`.
- Messaggi di commit in italiano, con prefisso `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`.

## Sicurezza

- Non leggere né committare file con segreti (`.env*`, `environment.local.ts`, chiavi). I permessi sono in `.claude/settings.json`, le esclusioni in `.gitignore`.
- Non scrivere chiavi, token o password nei file del repo né nella chat.
