---
paths:
  - "src/**/*.ts"
---

# Costanti

- **Ogni costante dichiarata con `const` sta in `shared/constants`**, mai in cima a un componente, servizio, direttiva o provider, anche se la usa una sola area (numeri, stringhe, liste, mappe di classi, selettori, timeout). Non esistono `constants/` in `core` o nelle feature. Valgono solo le costanti dichiarate: i valori scritti direttamente nel codice (`setTimeout(fn, 400)`) non vanno spostati.
- Eccezioni: le rotte (`Routes`) restano in `routes/<nome>.routes.ts`; negli spec le costanti di test possono restare nello spec.
- **Un file per ambito, al massimo 5**, non uno per costante: `navigation.const.ts` (pagine principali, gesti di navigazione come lo swipe), `ui.const.ts` (componenti generici dell'interfaccia: colori dei bottoni, toast, messaggi, skeleton di avvio), `form.const.ts` (regole e messaggi di validazione dei form) e `pack.const.ts` (busta settimanale: regole della settimana, strappo, carta, spotlight, ventaglio, pannello Top) e `api-error.const.ts` (codici di errore dell'API e chiavi di traduzione dei loro messaggi). Una costante nuova va nel file del suo ambito; un sesto file non si crea, e un nuovo ambito grande si discute prima. Dentro ogni file le costanti stanno a sezioni, con un'intestazione `// ─── Nome ───` per sezione, e un commento solo dove il numero non si capisce da solo.
- **Niente sottocartelle**: `shared/constants` contiene solo i file `*.const.ts` dei cinque ambiti, uno accanto all'altro. Un file `*.const.ts` contiene solo costanti (nessuna funzione) e non ha né cartella propria né spec obbligatorio (lo salta `scripts/check-specs.mjs`). Una funzione collegata a una costante va in un file a parte, con il suo spec, accanto a chi la usa (es. `mainPageIndex` in `core/providers/nav-direction/main-page-index/`) o, se la usano più aree, in `shared/utils/` (es. `editionSeverity`).
- Nel codice le costanti sono in `UPPER_SNAKE_CASE` (`MAIN_PAGES`, `PASSWORD_MIN_LENGTH`); liste e mappe sono `readonly`. **Gli enum non sono costanti: stanno in un `*.model.ts`** (es. `AppRoutes` in `shared/models/app-routes.model.ts`), in PascalCase, come i tipi usati dalle costanti (es. `button.model.ts` per `ui.const.ts`).
