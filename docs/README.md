# Documentazione di Komixy

Indice della documentazione del progetto. `CLAUDE.md` resta breve e rimanda qui per i dettagli: i file in `docs/` non sono caricati in automatico da Claude Code, si leggono quando servono.

| File | Contenuto |
|---|---|
| [architettura.md](architettura.md) | Stack, struttura delle cartelle, regole sulle dipendenze, routing, provider |
| [struttura-progetto.md](struttura-progetto.md) | Albero completo delle cartelle, esempio di feature, dove vanno i file |
| [funzionalita.md](funzionalita.md) | Pagine e funzionalità dell'app, stato di avanzamento |
| [tema-e-stile.md](tema-e-stile.md) | Tailwind, token del tema, effetto glass |
| [signal-forms.md](signal-forms.md) | Come funzionano i Signal Forms: schema, `FormField` e `FormRoot`, validazione, `novalidate`, esempio del login |
| [traduzioni.md](traduzioni.md) | Transloco, file `it.json`/`en.json`, controllo automatico |
| [sviluppo.md](sviluppo.md) | Comandi, flusso git, come funzionano i test (spec), lint, Knip, CI, deploy su Vercel |
| [claude-code.md](claude-code.md) | Come è configurato Claude Code: rules, hooks, skills, permessi |

## Come tenerla aggiornata

- Una cosa si scrive in un solo posto: se esiste già una regola in `.claude/rules/`, qui si rimanda senza ripeterla.
- Quando cambia la struttura (nuova feature, nuova rotta, nuovo hook) si aggiorna il file relativo nello stesso commit.
- Testi in italiano, titoli brevi, esempi solo se servono.
