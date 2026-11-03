# Traduzioni

Le regole sono in `.claude/rules/i18n.md`. Qui il funzionamento.

## Come funziona

- Libreria: Transloco, configurata in `app.config.ts`.
- File: `public/i18n/it.json` e `public/i18n/en.json`.
- Le traduzioni sono caricate prima dell'avvio dell'app (`provideAppInitializer`) tramite `TranslocoHttpLoader`.
- Lingua di default e di riserva: `it`. Oggi `availableLangs` contiene solo `it`: `en.json` va tenuto allineato, ma non è ancora selezionabile nell'app.

## Controllo automatico

`.claude/hooks/check-i18n.mjs` confronta le chiavi di tutti i file in `public/i18n/` e segnala chiavi mancanti e valori vuoti. Gira:

- dopo ogni modifica a un file in `public/i18n/` (hook `PostToolUse`);
- prima di ogni `git commit` (hook `guard-git.sh`).

Per lanciarlo a mano: `node .claude/hooks/check-i18n.mjs`.
