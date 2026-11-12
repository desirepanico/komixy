# Documentazione di Komixy

Questa cartella spiega come è fatto il progetto, per chi ci lavora (persone). Il [`README.md`](../README.md) nella radice è l'ingresso: dice cosa serve per lavorare, cosa è installato e come si parte; qui ci sono i dettagli di ogni area.

Claude Code non carica questi file: le sue istruzioni sono in [`CLAUDE.md`](../CLAUDE.md) e `.claude/rules/`. Per questo qui si spiega e non si definiscono regole (vedi «Come tenerla aggiornata»).

## Da dove cominciare

1. [funzionalita.md](funzionalita.md): cosa fa l'app, pagina per pagina, e a che punto è.
2. [architettura.md](architettura.md): stack, aree (`core`, `features`, `shared`), routing, provider.
3. [struttura-progetto.md](struttura-progetto.md): dove va ogni file, con l'albero e l'esempio di una feature.
4. [sviluppo.md](sviluppo.md): comandi, formattazione, test, lint, CI e deploy.

## Tutti i file

| File                                           | Contenuto                                                                                                        | Quando serve                                      |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| [funzionalita.md](funzionalita.md)             | Pagine, rotte, componenti condivisi, ospiti e iscritti, stato di avanzamento                                     | Capire cosa esiste e cosa è ancora segnaposto     |
| [architettura.md](architettura.md)             | Stack, regole sulle dipendenze, routing, servizi di navigazione, provider, accesso e ruoli                       | Prima di toccare la struttura o il routing        |
| [struttura-progetto.md](struttura-progetto.md) | Albero completo delle cartelle, dove vanno i file, come si aggiunge una feature                                  | Prima di creare un file o una feature             |
| [tema-e-stile.md](tema-e-stile.md)             | Tailwind, token del tema, effetto glass, transizione di pagina, ordine delle classi                              | Prima di toccare colori, CSS globale o animazioni |
| [traduzioni.md](traduzioni.md)                 | Transloco, file `it.json`/`en.json`, controllo automatico                                                        | Prima di aggiungere o cambiare testi              |
| [sviluppo.md](sviluppo.md)                     | Comandi, installazione automatica delle dipendenze, flusso git, Prettier, test, lint, Knip, CI, deploy su Vercel | Per lavorare ogni giorno e per pubblicare         |
| [claude-code.md](claude-code.md)               | Come è configurato Claude Code: `CLAUDE.md`, rules, hooks, skills, subagent, permessi                            | Per capire cosa fa Claude Code in automatico      |

Cosa è installato (pacchetti, strumenti, file di configurazione) è nel [`README.md`](../README.md) della radice, non qui.

## Come tenerla aggiornata

- Una regola si scrive in un solo posto: `CLAUDE.md` o `.claude/rules/`. Qui si descrive come funziona la cosa e si rimanda alla regola senza ripeterla.
- Quando cambia la struttura (nuova feature, nuova rotta, nuovo hook), un comando, una dipendenza o uno strumento, si aggiorna il file relativo nello stesso commit: `funzionalita.md` per le pagine, `sviluppo.md` per i comandi, il `README.md` della radice per ciò che è installato.
- Prima di un commit si controlla che qui non ci siano file o dipendenze che non esistono più.
- Testi in italiano, titoli brevi, esempi solo se servono.
