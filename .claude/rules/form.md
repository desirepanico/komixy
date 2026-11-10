---
paths:
  - "src/app/**/*.ts"
  - "src/app/**/*.html"
---

# Form con i Signal Forms (Angular 22)

Guide: https://angular.dev/guide/forms/signals/overview e https://angular.dev/guide/forms/signals/validation. API verificate sui tipi di `@angular/forms` 22.2.4 (`node_modules/@angular/forms/types/signals.d.ts`): se l'aggiornamento di Angular cambia un nome, correggi qui.

Dove sta cosa: qui le regole dei Signal Forms (schema, validazione, template, invio, test); i campi (`app-input-*`, label, placeholder, messaggi d'errore) in `.claude/rules/campi-form.md`.

## Principi

- I form nuovi usano i **Signal Forms**, import da `@angular/forms/signals`. Niente `FormBuilder`, `FormGroup`, `FormControl`, `ReactiveFormsModule`, `FormsModule` né `ngModel`.
- Un form esistente con Reactive Forms si migra quando lo si modifica in modo sostanziale, non di passaggio. Esempio già migrato: `features/auth/components/login-form`.

## Modello e schema

- Il modello è un `signal()` readonly con solo i dati e tutti i campi inizializzati (stringa vuota, non `undefined`: vorrebbe dire campo assente). `form(model, schema)` non ne fa una copia: scrivere su un campo aggiorna il modello.
- Il form è un `FieldTree`: `protected readonly form = form(this.model, (path) => { ... })`. Ogni campo è `form.email`, il suo stato si legge chiamandolo: `form.email()`.
- Le regole stanno **tutte** nello schema (secondo argomento di `form()`), legate ai percorsi dei campi (`path.email`). Niente `message` nelle regole: il testo lo sceglie il controllo dal `kind` (`campi-form.md`).

## Regole di validazione

- **Pronte**: `required` (vuoto = `null`, `undefined`, `''`, `false`, `NaN`; `0` e `[]` sono presenti, per un array si usa `minLength`), `email`, `min`, `max`, `minDate`, `maxDate`, `minLength`, `maxLength` (stringhe e array), `pattern`. Lo stato dei campi si regola con `disabled`, `readonly`, `hidden`.
- **Condizionali**: una regola con una condizione ha `when: ({ valueOf }) => valueOf(path.altroCampo)`. Più regole con la stessa condizione stanno in un blocco: `applyWhen(path, ({ valueOf }) => ..., (p) => { ... })` se i campi esistono sempre e cambia solo se contano (newsletter → email obbligatoria); `applyWhenValue(path.cliente, (c): c is Azienda => ..., (azienda) => { ... })` se cambia la forma dei dati (privato/azienda).
- **Date**: i limiti di `minDate` e `maxDate` in UTC (`new Date('2026-06-01')` o `Date.UTC(...)`), mai `new Date(anno, mese, giorno)` né `new Date()`. «Da oggi in poi» si ricompone in UTC: `Date.UTC(oggi.getFullYear(), oggi.getMonth(), oggi.getDate())`.
- **Array e sotto-oggetti**: `applyEach(path.items, ItemSchema)` per ogni elemento (`ItemSchema(item: SchemaPathTree<Item>)`), `apply(path.indirizzo, schema)` per un sotto-oggetto.
- **Personalizzate**: `validate(path.campo, ({ value, valueOf }) => ok ? null : { kind: 'nomeRegola' })`; per un controllo tra più campi si leggono gli altri con `valueOf`. Su un gruppo di campi (data di fine dopo quella di inizio, password e conferma) `validateTree(path, (ctx) => ...)` restituisce `{ kind, fieldTree: ctx.fieldTree.conferma }` (o un array) per attaccare l'errore al campo giusto. Una regola riusata in più form è una funzione che incapsula `validate` o uno `schema()` applicato con `apply()`. Ogni `kind` nuovo ha il suo testo in `common.validation.<kind>` (`campi-form.md`).
- **Asincrone**: `validateHttp(path.campo, { request, onSuccess, onError })` (o `validateAsync`); `onSuccess` restituisce un errore con `kind` o `null`, `onError` un errore proprio (es. `networkError`). Parte solo dopo le sincrone e a ogni modifica: `debounce(path.campo, 300)` riduce le richieste. Con `pending()` a `true` l'invio resta disabilitato e si dice che la verifica è in corso.

## Template

- `<form [formRoot]="form">`: `FormRoot` (in `imports`) imposta da solo `novalidate`, blocca il submit nativo e chiama `submit()`. Non scrivere `novalidate` né `(ngSubmit)`.
- Ogni campo sta in un componente di `shared/components/input/` (regole in `campi-form.md`), mai in un `<input>`, `<textarea>` o `<select>` scritto a mano nel form.
- Stato del campo, tutti signal: `value`, `errors`, `valid`, `invalid`, `pending`, `touched`, `dirty`, `disabled`, `submitting`. Errori di tutto il form: `form().errorSummary()`. Gli errori compaiono solo dopo l'interazione (`touched() && invalid()`): ci pensa il controllo (`campi-form.md`).
- Lo stile non si lega a `:valid`, `:invalid`, `validity` o `validationMessage` del browser, ma ai signal di stato.

## Invio

- `submit(this.form, { action: async (f) => { ... } })` esegue l'azione solo se il form è valido e segna i campi come toccati. Con `form(model, schema, { submission: { action } })` l'azione sta nella definizione e `[formRoot]` la usa da solo. `onInvalid` gestisce il tentativo con form non valido e porta il focus sul primo campo con l'errore (`field().errorSummary()[0]?.fieldTree().focusBoundControl()`, come in `login-form`; regola in `.claude/rules/accessibilita.md`).
- L'azione restituisce `undefined` se va a buon fine, oppure gli errori del server come `{ fieldTree, kind, message }` per mostrarli sul campo giusto. Un errore dell'API che non riguarda un campo (credenziali, server non raggiungibile) va invece in un toast (`ToastService.error('<nome>.summaryKo', '<nome>.detailKo')`) e l'azione restituisce `undefined`: un errore sul campo blocca un nuovo invio finché non si modifica il valore.
- Il bottone di invio si disabilita con `form().submitting()`, mai con `form().invalid()`: l'utente deve poter inviare un form non valido per vedere gli errori e portare il focus sul primo.

## Test

- Un test legge e scrive il modello (`model.set(...)`) o il valore del campo (`form.email().value.set(...)`) e controlla `invalid()`/`errors()`, poi l'HTML dopo `await fixture.whenStable()` (regole in `.claude/rules/test.md`).
- Ogni regola personalizzata ha i suoi test: un valore valido, uno non valido (con il `kind` atteso) e, se condizionale, il caso in cui non si applica.
