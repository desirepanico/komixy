---
paths:
  - "src/app/**/*.ts"
  - "src/app/**/*.html"
---

# Regole sui signal (Angular 22)

L'app è zoneless: ciò che cambia la vista sta in un signal.

## API da usare

- Input, output e query: `input()` / `input.required()`, `output()`, `model()` per il two-way binding, `viewChild()` / `viewChildren()` / `contentChild()` al posto dei decorator. Niente `@Input`, `@Output`, `@ViewChild`.
- Stato locale: `signal()`. Si aggiorna con `set` o `update` restituendo un nuovo oggetto o array, mai modificando quello dentro il signal e mai `mutate`.
- Valori derivati: `computed()`, non funzioni o getter che leggono un signal.
- Stato derivato ma modificabile: `linkedSignal()`.
- Dati asincroni da una richiesta: `resource()` / `httpResource()`.
- Da observable a signal: `toSignal()` (con `initialValue` o `requireSync` se serve un valore subito).
- Effetti collaterali: `effect()` solo quando serve (DOM, storage, log), mai per sincronizzare signal tra loro (per quello `computed` o `linkedSignal`). Dentro un effect, `untracked()` per le letture che non devono diventare dipendenze.

## Come si scrivono

- Ogni signal, `input()`, `output()`, `model()` e query è `readonly` (lo controlla ESLint). Un signal che non cambia mai non è un signal: usa una costante.
- Un servizio espone i signal in sola lettura (`asReadonly()`) e le modifiche passano da suoi metodi.
- Nei template si chiama il signal (`stato()`), non si salva il valore in una proprietà copiata.
- Costanti usate nel template (es. `AppRoutes`): `protected readonly AppRoutes = AppRoutes;`, senza signal.
