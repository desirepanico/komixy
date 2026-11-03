# Sviluppo

## Comandi

| Comando | Cosa fa |
|---|---|
| `npm start` | Dev server su http://localhost:4200 |
| `npm run build` | Build di produzione |
| `npm test` | Test con Vitest (una sola esecuzione) |
| `npm run deploy:login` | Accesso a Vercel (una volta sola) |
| `npm run deploy:dev` | Preview su Vercel |
| `npm run deploy:prod` | Pubblicazione in produzione |

## Flusso git

- Le regole sui branch sono in `.claude/rules/git.md`: nessun branch nuovo di iniziativa, il nome lo sceglie l'utente.
- Messaggi di commit in italiano con prefisso `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`.
- Prima del push: `git pull --rebase origin develop`.
- Prima di ogni commit lancia `npm run build` e `npm test`.

## Test

Regole in `.claude/rules/test.md`: si testano servizi, guard, `computed()` con logica di business e funzioni pure. Il file `*.spec.ts` sta accanto al file testato.

## Deploy

L'app è una single page app su Vercel. `vercel.json` definisce il comando di build, la cartella di output (`dist/komixy/browser`) e il rewrite di ogni percorso su `index.html`.

## Sicurezza

Non leggere né committare file con segreti (`.env*`, `environment.local.ts`, chiavi). I permessi sono in `.claude/settings.json`, le esclusioni in `.gitignore`.
