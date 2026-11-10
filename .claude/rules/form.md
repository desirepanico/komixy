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
- Validatori pronti: `required`, `email`, `minLength`, `maxLength`, `min`, `max`, `pattern`, `validate` (personalizzato), `validateAsync`/`validateHttp` (asincroni). Lo stato dei campi si regola con `disabled`, `readonly`, `hidden`. Il messaggio non si scrive nello schema né nel form: lo sceglie il controllo (sezione «Campi»).

## Template

- `<form [formRoot]="form">`: `FormRoot` imposta da solo `novalidate`, blocca il submit nativo e chiama `submit()`. Non scrivere `(ngSubmit)`.
- Ogni campo sta in un componente di `shared/components/input/`, mai in un `<input>`, `<textarea>` o `<select>` scritto a mano nel form. `app-input-text` riceve il campo con `[field]="form.email"` e il suo `<input>` lo lega con `[formField]` (`type` `text` o `email`, `autocomplete` opzionale); `app-input-password` fa lo stesso con `[field]="form.password"`. Non aggiungere `[value]`, `[disabled]` o `[required]`: li imposta la direttiva dallo stato.
- Stato del campo, tutti signal: `value`, `errors`, `invalid`, `valid`, `touched`, `dirty`, `disabled`, `pending`, `submitting`. Errori di tutto il form: `form().errorSummary()`.
- Gli errori compaiono solo dopo l'interazione (campo toccato o form inviato): ci pensa già il controllo.

## Campi

Ogni campo di un form ha, sempre, tutte e quattro queste cose:

- **Label**: il nome del campo, chiave Transloco (`label="login.email"`).
- **Placeholder**: un esempio o un suggerimento, chiave Transloco (`placeholder="login.emailPlaceholder"`). `placeholder` e `label` sono `input.required()` dei controlli, quindi il build non passa senza.
- **`app-field-wrapper`**: sta dentro ogni controllo (`app-input-*`) e mostra la label e, con `errors` non vuoto, `app-error-message`, con l'`inputId` collegato (`for`, `aria-describedby` sull'id `<inputId>-error`). Il controllo passa `errors` solo se il campo è toccato e non valido (`showError`). Un nuovo tipo di campo (select, checkbox, textarea...) è un componente in `shared/components/input/` che usa `app-field-wrapper`: mai un controllo nudo nel form. Il controllo riceve il campo come `field` (`input.required<FieldTree<string>>()`) e legge `touched` e gli errori da lì (`field()()`); `[formField]` sul suo `<input>` scrive il valore e segna il campo come toccato all'uscita, quindi il controllo non ha `value`, `model()` né `markAsTouched()`.
- **Messaggio d'errore** per ogni validatore dello schema. Il testo è generico e sta in `common.validation.<kind>` (`it.json` e `en.json`), scelto da `app-error-message` (dentro `app-field-wrapper`) dal `kind` dell'errore, e segue il cambio lingua; nel testo `{{ field }}` è il nome del campo (la label) e le proprietà dell'errore (es. `{{ minLength }}`) sono parametri. Un `kind` senza testo usa `common.validation.generic`. Un validatore nuovo (`maxLength`, `pattern`, ...) aggiunge la sua chiave in tutte le lingue; non si scrivono messaggi nel singolo form.

## Invio

- `submit(this.form, { action: async (f) => { ... } })` esegue l'azione solo se il form è valido e segna i campi come toccati. Con `form(model, schema, { submission: { action } })` l'azione sta nella definizione e `[formRoot]` la usa da solo. `onInvalid` gestisce il tentativo con form non valido e porta il focus sul primo campo con l'errore (`field().errorSummary()[0]?.fieldTree().focusBoundControl()`, come in `login-form`; regola in `.claude/rules/accessibilita.md`).
- L'azione restituisce `undefined` se va a buon fine, oppure gli errori del server come `{ fieldTree, kind, message }` per mostrarli sul campo giusto. Un errore dell'API che non riguarda un campo (credenziali, server non raggiungibile) va invece in un toast (`ToastService.error('<azione>')`, chiavi `<azione>.summaryKo` e `<azione>.detailKo`) e l'azione restituisce `undefined`: un errore sul campo blocca un nuovo invio finché non si modifica il valore.
- Mentre l'azione è in corso `form().submitting()` è `true`: usalo per disabilitare il bottone di invio.

## Test

- Un test legge e scrive il modello (`model.set(...)`) o il valore del campo (`form.email().value.set(...)`) e controlla `invalid()`/`errors()`, poi l'HTML dopo `await fixture.whenStable()` (regole in `.claude/rules/test.md`).
