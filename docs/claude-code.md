# Configurazione di Claude Code

Struttura della cartella `.claude/` e di `CLAUDE.md`, secondo la documentazione di Claude Code.

```
CLAUDE.md                istruzioni sempre caricate: comandi, struttura, flusso (breve)
.claude/
├── settings.json        permessi e hook condivisi col team
├── rules/               una regola per argomento
├── skills/              procedure riusabili
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
| `test.md` | Test e spec (zoneless, provider, pulizia automatica) | `src/**/*.ts` |
| `i18n.md` | Traduzioni | `public/i18n/**`, `src/app/**` |
| `commenti.md` | Commenti nel codice: solo il perché, in italiano | `src/**/*.ts`, `*.html`, `*.css`, `public/theme/**` |
| `git.md` | Branch | sempre |

## Hooks (`.claude/hooks/`, registrati in `settings.json`)

| Evento | Script | Cosa fa |
|---|---|---|
| `SessionStart` | `setup-deps.sh` | `npm ci` se manca `node_modules` |
| `PostToolUse` (Edit/Write) | `after-edit.sh` | controlla `it.json`/`en.json` se modificati; lancia ESLint sui file `.ts`/`.html` di `src/`; ricorda di creare lo spec se un `.ts` non ce l'ha. Gli errori sono mostrati a Claude |

Gli hook sono controlli eseguiti sempre dalla harness; le rules sono indicazioni che Claude può non rispettare. Ciò che si può far controllare a uno script va in un hook.

## Permessi (`settings.json`)

- `allow`: build, test, lint, start, comandi git di sola lettura, `git add`, `git commit` e `git pull --rebase origin develop`.
- `ask`: `git push` e `npm run deploy:*`.
- `deny`: lettura dei file con segreti, push forzati e creazione di branch (`git checkout -b`, `git switch -c`, `git branch <nome>`, `git worktree add`).

## Skills (`.claude/skills/`)

- `shared-component`: crea o modifica un componente in `shared/components`.

## Quando aggiungere cosa

- Un divieto o un controllo verificabile → hook.
- Una convenzione legata a certi file → rule con `paths:`.
- Una procedura in più passi → skill.
- Contesto utile ma non sempre → `docs/`.
