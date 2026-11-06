---
paths:
  - "src/app/**/*.ts"
  - "src/app/**/*.html"
---

# Form con i Signal Forms (Angular 22)

Guida: https://angular.dev/guide/forms/signals/overview. API verificate sui tipi di `@angular/forms` 22.2.4 (`node_modules/@angular/forms/types/signals.d.ts`): se l'aggiornamento di Angular cambia un nome, correggi qui.

- I form nuovi usano i **Signal Forms**, import da `@angular/forms/signals`. Niente `FormBuilder`, `FormGroup`, `FormControl`, `ReactiveFormsModule`, `FormsModule` né `ngModel`.
- Un form esistente con Reactive Forms si migra quando lo si modifica in modo sostanziale, non di passaggio. Esempio già migrato: `features/auth/components/login-form`.

## Modello e campi

- Il modello è un `signal()` readonly con tutti i campi inizializzati (stringa vuota, non `undefined`). `form(model, schema)` non ne fa una copia: scrivere su un campo aggiorna il modello.
- Il form è un `FieldTree`: `protected readonly form = form(this.model, (path) => { ... })`. Ogni campo è `form.email`, il suo stato si legge chiamandolo: `form.email()`.
- Le regole di validazione stanno nello schema (secondo argomento di `form()`). Se si riusano, in un `schema()` condiviso; per liste e sotto-oggetti `applyEach()` e `apply()`.
- Validatori pronti: `required`, `email`, `minLength`, `maxLength`, `min`, `max`, `pattern`, `validate` (personalizzato), `validateAsync`/`validateHttp` (asincroni). Lo stato dei campi si regola con `disabled`, `readonly`, `hidden`. Il messaggio non si scrive nello schema: lo mostra il template con una chiave Transloco (`.claude/rules/i18n.md`).

## Template

- `<form [formRoot]="form" novalidate>`: `FormRoot` imposta `novalidate`, blocca il submit nativo e chiama `submit()`. Non scrivere `(ngSubmit)`.
- Ogni controllo si lega con `[formField]="form.email"` (direttiva `FormField`, in `imports`) su `<input>`, `<textarea>`, `<select>` o su un controllo custom (`FormValueControl`/`FormCheckboxControl`). Non aggiungere `[value]`, `[disabled]` o `[required]`: li imposta la direttiva dallo stato.
- Stato del campo, tutti signal: `value`, `errors`, `invalid`, `valid`, `touched`, `dirty`, `disabled`, `pending`, `submitting`. Errori di tutto il form: `form().errorSummary()`.
- Gli errori compaiono solo dopo l'interazione: `@if (form.email().touched() && form.email().invalid())`. `kind` dell'errore (`required`, `email`, `minLength`, `pattern`, ...) sceglie la chiave di traduzione. Accessibilità: `aria-invalid`, `aria-describedby` e `role="alert"` come in `.claude/rules/accessibilita.md`.

## Invio

- `submit(this.form, { action: async (f) => { ... } })` esegue l'azione solo se il form è valido e segna i campi come toccati. Con `form(model, schema, { submission: { action } })` l'azione sta nella definizione e `[formRoot]` la usa da solo. `onInvalid` gestisce il tentativo con form non valido (es. focus sul primo errore).
- L'azione restituisce `undefined` se va a buon fine, oppure gli errori del server come `{ fieldTree, kind, message }` per mostrarli sul campo giusto.
- Mentre l'azione è in corso `form().submitting()` è `true`: usalo per disabilitare il bottone di invio.

## Test

- Un test legge e scrive il modello (`model.set(...)`) o il valore del campo (`form.email().value.set(...)`) e controlla `invalid()`/`errors()`, poi l'HTML dopo `await fixture.whenStable()` (regole in `.claude/rules/test.md`).
