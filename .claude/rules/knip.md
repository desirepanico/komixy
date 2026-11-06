---
paths:
  - "src/**/*.ts"
  - "knip.json"
  - "scripts/*.mjs"
---

# Regole sul codice inutilizzato (Knip)

- `npm run knip` deve passare: gira anche in CI.
- Se Knip segnala file, componenti, funzioni, costanti, tipi, export o dipendenze inutilizzati, **toglili**: cancella il file insieme al suo `*.spec.ts` e `.html`, oppure l'export, oppure la dipendenza da `package.json`.
- Non far passare Knip aggiungendo `ignore` o `entry` in `knip.json`. L'eccezione è un file davvero usato in un modo che Knip non vede (es. caricato da uno script o dalla configurazione): in quel caso aggiungilo a `entry` e dillo all'utente.
- Un export usato solo dal proprio spec è inutilizzato: toglilo dal codice e dal test.
- Se togliendo un componente restano chiavi di traduzione senza uso, rimuovile (regola in `i18n.md`).
- Knip 6 non controlla i membri delle classi: un `input()`, un metodo o una proprietà dichiarati e mai usati non li vede, né un export usato solo nello stesso file (es. un tipo nella firma di un `input()`). Cercali tu a mano quando scrivi o modifichi un componente e togli ciò che non serve.
