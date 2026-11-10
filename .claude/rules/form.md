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
- Ogni campo sta in un componente di `shared/components/input/`, mai in un `<input>`, `<textarea>` o `<select>` scritto a mano nel form. `app-input-text` riceve il campo con `[field]="form.email"` e il suo `<input>` lo lega con `[formField]`; `app-input-password` si lega con `[formField]="form.password"` (direttiva `FormField`, in `imports`). Non aggiungere `[value]`, `[disabled]` o `[required]`: li imposta la direttiva dallo stato.
- Stato del campo, tutti signal: `value`, `errors`, `invalid`, `valid`, `touched`, `dirty`, `disabled`, `pending`, `submitting`. Errori di tutto il form: `form().errorSummary()`.
- Gli errori compaiono solo dopo l'interazione (campo toccato o form inviato): ci pensa già il controllo.

## Campi

Ogni campo di un form ha, sempre, tutte e quattro queste cose:

- **Label**: il nome del campo, chiave Transloco (`label="login.email"`).
- **Placeholder**: un esempio o un suggerimento, chiave Transloco (`placeholder="login.emailPlaceholder"`). `placeholder` e `label` sono `input.required()` dei controlli, quindi il build non passa senza.
- **`app-field-wrapper`**: sta dentro ogni controllo (`app-input-*`) e mostra label ed errore con l'`inputId` collegato (`for`, `aria-describedby`). Un nuovo tipo di campo (select, checkbox, textarea...) è un componente in `shared/components/input/` che usa `app-field-wrapper`: mai un controllo nudo nel form. Il controllo legge `touched` ed errori iniettando `FormField` (`inject(FormField)`, poi `state().touched()` ed `errors()`) e non li dichiara come `input()`: sono pubblici e il form non li userebbe mai. All'uscita dal campo chiama `state().markAsTouched()` (niente `output()` `touch`). Servono solo `value` (`model()`) e gli input che il controllo usa davvero (es. `disabled`).
- **Messaggio d'errore** per ogni validatore dello schema. Il testo è generico e sta in `validation.*` (`it.json` e `en.json`), scelto dal `kind` dell'errore con `VALIDATION_MESSAGES` (`shared/constants/form.const.ts`) e con il nome del campo (`{{ name }}`, la label). Un validatore nuovo (`maxLength`, `pattern`, ...) aggiunge il suo `kind` a `VALIDATION_MESSAGES` e la sua chiave in tutte le lingue; non si scrivono messaggi nel singolo form.

## Invio

- `submit(this.form, { action: async (f) => { ... } })` esegue l'azione solo se il form è valido e segna i campi come toccati. Con `form(model, schema, { submission: { action } })` l'azione sta nella definizione e `[formRoot]` la usa da solo. `onInvalid` gestisce il tentativo con form non valido e porta il focus sul primo campo con l'errore (`field().errorSummary()[0]?.fieldTree().focusBoundControl()`, come in `login-form`; regola in `.claude/rules/accessibilita.md`).
- L'azione restituisce `undefined` se va a buon fine, oppure gli errori del server come `{ fieldTree, kind, message }` per mostrarli sul campo giusto.
- Mentre l'azione è in corso `form().submitting()` è `true`: usalo per disabilitare il bottone di invio.

## Test

- Un test legge e scrive il modello (`model.set(...)`) o il valore del campo (`form.email().value.set(...)`) e controlla `invalid()`/`errors()`, poi l'HTML dopo `await fixture.whenStable()` (regole in `.claude/rules/test.md`).
