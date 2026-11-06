---
paths:
  - "src/**/*.ts"
---

# Costanti

- **Ogni costante sta in una cartella `constants/`**, mai in cima a un componente, servizio, direttiva o provider: numeri, stringhe, liste, mappe di classi, selettori, timeout. Eccezioni: le rotte (`Routes`) restano in `routes/<nome>.routes.ts`; negli spec le costanti di test possono restare nello spec.
- Dove: `shared/constants` se la usano più feature o `core`; altrimenti nella `constants/` della sua area (`core/constants`, `features/<nome>/constants`). Le dipendenze tra aree non cambiano (vedi `CLAUDE.md`).
- **Un file per argomento, non per costante**: le costanti che parlano della stessa cosa stanno nello stesso file (es. `navigation.const.ts` con `AppRoutes` e `MAIN_PAGES`). Si crea un file nuovo solo per un argomento nuovo.
- **Niente sottocartelle**: `constants/` contiene solo file `<argomento>.const.ts`, uno accanto all'altro. Un file `*.const.ts` non ha né cartella propria né spec obbligatorio (lo salta `scripts/check-specs.mjs`); se contiene una funzione collegata, la logica si testa in uno spec accanto.
- Nel codice le costanti sono `readonly` e in `UPPER_SNAKE_CASE` (`MAIN_PAGES`, `PASSWORD_MIN_LENGTH`); un enum resta in PascalCase (`AppRoutes`). I tipi usati dalle costanti stanno in `models/` (es. `button.model.ts` per `button.const.ts`).
