---
paths:
  - "src/app/**/*.ts"
  - "src/app/**/*.html"
---

# Regole sui signal (Angular 22)

L'app è zoneless e **tutto lo stato è un signal**: ciò che cambia nel tempo (anche un contatore, le coordinate di un gesto, un flag interno) sta in un `signal()`, mai in una proprietà modificabile (`this.x = …`, `this.x++`) né in una variabile di classe.

## API da usare

- Input, output e query: `input()` / `input.required()`, `output()`, `model()` per il two-way binding, `viewChild()` / `viewChildren()` / `contentChild()` al posto dei decorator. Niente `@Input`, `@Output`, `@ViewChild`.
- Stato locale: `signal()`. Si aggiorna con `set` o `update` restituendo un nuovo oggetto o array, mai modificando quello dentro il signal e mai `mutate`.
- Valori derivati: `computed()`, non funzioni o getter che leggono un signal.
- Stato derivato ma modificabile: `linkedSignal()`.
- Dati asincroni da una richiesta: `resource()` / `httpResource()`.
- Da observable a signal: `toSignal()` (con `initialValue` o `requireSync` se serve un valore subito). Mai la pipe `async` nei template e mai `subscribe()` per riempire lo stato.
- Una richiesta singola (es. il login): `firstValueFrom()` dentro una funzione `async`, non `subscribe()`.
- Effetti collaterali: `effect()` solo quando serve (DOM, storage, log), mai per sincronizzare signal tra loro (per quello `computed` o `linkedSignal`). Dentro un effect, `untracked()` per le letture che non devono diventare dipendenze.

## Come si scrivono

- Ogni proprietà di classe è `readonly`, e ogni signal, `input()`, `output()`, `model()` e query lo è per forza (lo controlla ESLint: `no-restricted-syntax` rifiuta una proprietà non `readonly`). Un signal che non cambia mai non è un signal: usa una costante.
- Un registro di risorse (una `Map` di timer, un listener da rimuovere) si tiene in una proprietà `readonly` o in un signal di funzione; non è stato dell'interfaccia, ma non va riassegnato.
- Un servizio espone i signal in sola lettura (`asReadonly()`) e le modifiche passano da suoi metodi.
- Nei template si chiama il signal (`stato()`), non si salva il valore in una proprietà copiata.
- Costanti usate nel template (es. `AppRoutes`): `protected readonly AppRoutes = AppRoutes;`, senza signal.

## Eccezione

I provider di avvio (`core/providers`) possono usare `subscribe()` sugli eventi del router per un effetto sul DOM (la direzione di navigazione, lo skeleton di avvio): non producono stato dell'interfaccia. ESLint lo permette solo lì.

## Controlli

- `npm run lint`: ESLint rifiuta le proprietà non `readonly`, `subscribe()` fuori da `core/providers` e la pipe `async` nei template.
- Una classe nuova o modificata segue l'ordine dei membri di `angular.md` («Ordine dei membri»), controllato da `scripts/check-class-order.mjs`.
