---
paths:
  - "src/**/*.spec.ts"
---

# Regole sui test

- Test con Vitest (`npm test`). Il file `*.spec.ts` sta accanto al file che testa.
- **Ogni file `.ts` di `src/` ha il suo `*.spec.ts` accanto**: componenti, pagine, direttive, servizi, guard, interceptor, provider, funzioni, costanti, rotte e configurazione. Eccezioni: i file `*.model.ts` (solo tipi ed enum) e `main.ts`. Lo controlla `npm run lint` (`scripts/check-specs.mjs`): un file nuovo senza spec non passa.
- Un componente senza logica ha almeno un test che lo crea e controlla ciò che mostra (testi come chiavi Transloco, link, attributi ARIA). Per servizi, guard, funzioni pure e `computed()` con regole di business testa ogni comportamento.
- Componenti con Transloco: `TranslocoTestingModule.forRoot({ langs: { it: {} }, translocoConfig: { availableLangs: ['it'], defaultLang: 'it' } })`; i testi sono le chiavi. Con `routerLink`: `provideRouter([])`.
- Un test controlla un solo comportamento, con un nome che lo descrive in italiano.
- Prima di consegnare una modifica lancia `npm test`, `npm run lint` e `npm run build`.
