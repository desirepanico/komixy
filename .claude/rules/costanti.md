---
paths:
  - "src/**/*.ts"
---

# Costanti

- **Ogni costante dichiarata con `const` sta in `shared/constants`**, mai in cima a un componente, servizio, direttiva o provider, anche se la usa una sola area (numeri, stringhe, liste, mappe di classi, selettori, timeout). Non esistono `constants/` in `core` o nelle feature. Valgono solo le costanti dichiarate: i valori scritti direttamente nel codice (`setTimeout(fn, 400)`) non vanno spostati.
- Eccezioni: le rotte (`Routes`) restano in `routes/<nome>.routes.ts`; negli spec le costanti di test possono restare nello spec.
- **Al massimo 3 file**, uno per ambito, non uno per costante: `navigation.const.ts` (pagine principali, gesti di navigazione come lo swipe), `ui.const.ts` (aspetto e comportamento dell'interfaccia: colori dei bottoni, skeleton di avvio) e `form.const.ts` (regole e messaggi di validazione dei form). Una costante nuova va nel file del suo ambito; un quarto file non si crea.
- **Niente sottocartelle**: `shared/constants` contiene solo i file `*.const.ts` dei tre ambiti, uno accanto all'altro. Un file `*.const.ts` contiene solo costanti (nessuna funzione) e non ha né cartella propria né spec obbligatorio (lo salta `scripts/check-specs.mjs`). Una funzione collegata a una costante va in un file a parte, con il suo spec, accanto a chi la usa (es. `mainPageIndex` in `core/providers/nav-direction/main-page-index/`).
- Nel codice le costanti sono in `UPPER_SNAKE_CASE` (`MAIN_PAGES`, `PASSWORD_MIN_LENGTH`); liste e mappe sono `readonly`. **Gli enum non sono costanti: stanno in un `*.model.ts`** (es. `AppRoutes` in `shared/models/app-routes.model.ts`), in PascalCase, come i tipi usati dalle costanti (es. `button.model.ts` per `ui.const.ts`).
