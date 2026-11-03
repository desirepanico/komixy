---
paths:
  - "src/**/*.spec.ts"
---

# Regole sui test

- Test con Vitest (`npm test`). Il file `*.spec.ts` sta accanto al file che testa.
- Scrivi test per la logica non banale: servizi, guard, `computed()` con regole di business e funzioni pure.
- Non servono test per componenti che mostrano solo dati o per semplici template.
- Un test controlla un solo comportamento, con un nome che lo descrive in italiano.
- Prima di consegnare una modifica lancia `npm test` e `npm run build`.
