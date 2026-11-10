# Traduzioni

Le regole sono in `.claude/rules/i18n.md`. Qui il funzionamento.

## Come funziona

- Libreria: Transloco, configurata in `app.config.ts`.
- File: `public/i18n/it.json` e `public/i18n/en.json`.
- Le traduzioni si scaricano in anticipo con un `<link rel="preload">` in `src/index.html`, che oggi punta a `it.json`: se la lingua di avvio cambia, va cambiato anche lì. Il loader non aggiunge parametri all'indirizzo, così il browser può riusare il file.
- Le traduzioni sono caricate prima dell'avvio dell'app (`provideAppInitializer`) tramite `TranslocoHttpLoader`.
- Lingua di default e di riserva: `it`. Oggi `availableLangs` contiene solo `it`: `en.json` va tenuto allineato, ma non è ancora selezionabile nell'app.

## Controllo automatico

`.claude/hooks/check-i18n.mjs` confronta le chiavi di tutti i file in `public/i18n/` e segnala chiavi mancanti e valori vuoti. Gira:

- dopo ogni modifica a un file in `public/i18n/` (hook `PostToolUse`).

Per lanciarlo a mano: `node .claude/hooks/check-i18n.mjs`.

## Chiavi dei messaggi

- **Validazione dei form**: `common.validation.<kind>` (es. `required`, `minLength`), con `{{ field }}` per il nome del campo e le proprietà dell'errore come parametri (`{{ minLength }}`). `common.validation.generic` vale per i tipi di errore senza testo.
- **Toast**: titolo e dettaglio sono due chiavi passate per intero a `ToastService` (`toastService.error('login.serverError.summaryKo', 'login.serverError.detailKo')`). I nomi seguono lo schema `<nome>.summaryOk` / `<nome>.detailOk` (`success`), `summaryKo` / `detailKo` (`error`), `summaryInfo` / `detailInfo` (`info`), `summaryWarn` / `detailWarn` (`warn`); i valori variabili si passano come parametri. Un messaggio con più esiti di errore ha un nome per ciascuno (`login.invalidCredentials`, `login.serverError`).
