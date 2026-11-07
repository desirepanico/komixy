---
paths:
  - "src/**/*.ts"
---

# Costanti

- **Ogni costante dichiarata con `const` sta in `shared/constants`**, mai in cima a un componente, servizio, direttiva o provider, anche se la usa una sola area (numeri, stringhe, liste, mappe di classi, selettori, timeout). Non esistono `constants/` in `core` o nelle feature. Valgono solo le costanti dichiarate: i valori scritti direttamente nel codice (`setTimeout(fn, 400)`) non vanno spostati.
- Eccezioni: le rotte (`Routes`) restano in `routes/<nome>.routes.ts`; negli spec le costanti di test possono restare nello spec.
- **Un file per argomento, non per costante**: le costanti che parlano della stessa cosa stanno nello stesso file (es. `button.const.ts` con i colori di tutte le varianti del bottone). Si crea un file nuovo solo per un argomento nuovo.
- **Niente sottocartelle**: `shared/constants` contiene solo file `<argomento>.const.ts`, uno accanto all'altro. Un file `*.const.ts` contiene solo costanti (nessuna funzione) e non ha né cartella propria né spec obbligatorio (lo salta `scripts/check-specs.mjs`). Una funzione collegata a una costante va in un file a parte, con il suo spec, accanto a chi la usa (es. `mainPageIndex` in `core/providers/nav-direction/main-page-index/`).
- Nel codice le costanti sono in `UPPER_SNAKE_CASE` (`MAIN_PAGES`, `PASSWORD_MIN_LENGTH`); liste e mappe sono `readonly`. **Gli enum non sono costanti: stanno in un `*.model.ts`** (es. `AppRoutes` in `shared/models/app-routes.model.ts`), in PascalCase, come i tipi usati dalle costanti (es. `button.model.ts` per `button.const.ts`).
