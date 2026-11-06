# Configurazione di Claude Code

Struttura della cartella `.claude/` e di `CLAUDE.md`, secondo la documentazione di Claude Code.

```
CLAUDE.md                istruzioni sempre caricate: comandi, struttura, flusso (breve)
.claude/
├── settings.json        permessi e hook condivisi col team
├── rules/               una regola per argomento
├── skills/              procedure riusabili
├── agents/              subagent (revisore)
└── hooks/               script richiamati da settings.json
docs/                    documentazione del progetto (questa cartella)
```

## CLAUDE.md

Solo l'essenziale. I dettagli stanno in `.claude/rules/` e in `docs/`, che CLAUDE.md richiama senza ripeterli.

## Rules (`.claude/rules/`)

| File | Argomento | Si carica su (`paths:`) |
|---|---|---|
| `angular.md` | Angular e TypeScript | `src/app/**/*.ts` e `*.html` |
| `stile.md` | Tailwind e tema | `src/**/*.html`, `*.css`, `public/theme/**` |
| `accessibilita.md` | WCAG AA e uso da tastiera | `src/app/**/*.html` e `*.ts` |
| `costanti.md` | Costanti: in `constants/`, un file per argomento, senza sottocartelle | `src/**/*.ts` |
| `form.md` | Form con i Signal Forms (Angular 22) | `src/app/**/*.ts` e `*.html` |
| `skeleton.md` | Quando e come usare `app-skeleton` | `src/**/*.html` |
| `test.md` | Test e spec (zoneless, provider, pulizia automatica) | `src/**/*.ts` |
| `i18n.md` | Traduzioni | `public/i18n/**`, `src/app/**` |
| `commenti.md` | Commenti nel codice: solo il perché, in italiano | `src/**/*.ts`, `*.html`, `*.css`, `public/theme/**` |
| `knip.md` | Codice inutilizzato: si toglie, non si nasconde in `knip.json` | `src/**/*.ts`, `knip.json`, `scripts/*.mjs` |
| `git.md` | Branch | sempre |

## Hooks (`.claude/hooks/`, registrati in `settings.json`)

| Evento | Script | Cosa fa |
|---|---|---|
| `SessionStart` | `setup-deps.sh` | lancia `scripts/ensure-deps.mjs`: `npm install` se `node_modules` manca o `package.json`/`package-lock.json` sono cambiati |
| `PostToolUse` (Edit/Write) | `after-edit.sh` | se `package.json` è modificato installa le dipendenze (`scripts/ensure-deps.mjs`); controlla `it.json`/`en.json` se modificati; lancia ESLint sui file `.ts`/`.html` di `src/`; ricorda di creare lo spec se un `.ts` non ce l'ha. Gli errori sono mostrati a Claude |
| `Stop` | `before-stop.sh` | se ci sono modifiche a `src/`, traduzioni, `scripts/` o configurazione, lancia `npm run lint`, `knip`, `build` e `npm test`; se uno fallisce esce con codice 2 e Claude continua a correggere. Dopo otto blocchi di fila Claude Code chiude comunque il turno |

Gli hook sono controlli eseguiti sempre dalla harness; le rules sono indicazioni che Claude può non rispettare. Ciò che si può far controllare a uno script va in un hook.

## Permessi (`settings.json`)

- `allow`: build, test, lint, start, comandi git di sola lettura, `git add`, `git commit` e `git pull --rebase origin develop`.
- `ask`: `git push` e `npm run deploy:*`.
- `deny`: lettura dei file con segreti, push forzati e creazione di branch (`git checkout -b`, `git switch -c`, `git branch <nome>`, `git worktree add`).

## Skills (`.claude/skills/`)

- `shared-component`: crea o modifica un componente in `shared/components`. Si usa anche prima di duplicare markup: se esiste già lo si importa, se sta per comparire una seconda volta lo si estrae e lo si importa in entrambi i punti.
- `use-shared`: usa un componente di `shared/components` indicandone il nome (`/use-shared <nome> [dove]`). Se il nome manca o è impreciso propone i componenti esistenti (elenco generato dalle cartelle). Legge selector e input dal codice del componente, lo importa e lo inserisce senza duplicare markup.

## Subagent (`.claude/agents/`)

- `reviewer`: revisore indipendente a sola lettura (`Read`, `Grep`, `Glob`). Non ha visto la conversazione, quindi giudica solo il codice: si invoca a lavoro finito, prima del commit, passandogli i file modificati (o il diff). Controlla bug, regole di `.claude/rules/`, accessibilità, traduzioni, test e confini tra aree; non segnala lo stile (lo fanno lint e Prettier) e non modifica nulla.

## Quando aggiungere cosa

- Un divieto o un controllo verificabile → hook.
- Una convenzione legata a certi file → rule con `paths:`.
- Una procedura in più passi → skill.
- Contesto utile ma non sempre → `docs/`.
