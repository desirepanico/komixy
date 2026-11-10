---
paths:
  - "src/app/**/*.ts"
  - "src/app/**/*.html"
---

# Form con i Signal Forms (Angular 22)

Guide: https://angular.dev/guide/forms/signals/overview e https://angular.dev/guide/forms/signals/validation. API verificate sui tipi di `@angular/forms` 22.2.4 (`node_modules/@angular/forms/types/signals.d.ts`): se l'aggiornamento di Angular cambia un nome, correggi qui. Come funziona la validazione e perché: `docs/signal-forms.md`.

## Principi

- I form nuovi usano i **Signal Forms**, import da `@angular/forms/signals`. Niente `FormBuilder`, `FormGroup`, `FormControl`, `ReactiveFormsModule`, `FormsModule` né `ngModel`.
- Un form esistente con Reactive Forms si migra quando lo si modifica in modo sostanziale, non di passaggio. Esempio già migrato: `features/auth/components/login-form`.

## Modello e schema

- Il modello è un `signal()` readonly con tutti i campi inizializzati (stringa vuota, non `undefined`: `undefined` vuol dire campo assente). Contiene solo i dati. `form(model, schema)` non ne fa una copia: scrivere su un campo aggiorna il modello.
- Il form è un `FieldTree`: `protected readonly form = form(this.model, (path) => { ... })`. Ogni campo è `form.email`, il suo stato si legge chiamandolo: `form.email()`.
- Le regole di validazione stanno **tutte** nello schema (secondo argomento di `form()`), che gira una sola volta e riceve i percorsi dei campi (`path.email`): le regole si legano ai percorsi, non ai valori.
- **Niente `message` nelle regole**, né nello schema né nel form: il testo lo sceglie il controllo dal `kind` dell'errore (sezione «Campi»).
- Le regole sono indipendenti e la validazione non si ferma al primo errore: un campo può avere più errori. Il controllo ne mostra uno solo, il primo (`errors()[0]`).

## Regole di validazione

### Regole pronte

| Regola | Uso |
|---|---|
| `required` | Vuoto = `null`, `undefined`, `''`, `false`, `NaN`. `0` e `[]` sono presenti: per un array si usa `minLength` |
| `email` | Formato email |
| `min`, `max` | Valori numerici |
| `minDate`, `maxDate` | Valori `Date` (es. `<input type="date">`) |
| `minLength`, `maxLength` | Stringhe (caratteri) e array (elementi) |
| `pattern` | Espressione regolare sul testo |

Lo stato dei campi si regola con `disabled`, `readonly`, `hidden`.

### Condizionali

- Una regola che vale solo a una condizione ha `when: ({ valueOf }) => valueOf(path.altroCampo)`: gira solo se restituisce `true`.
- Più regole con la stessa condizione stanno in un blocco, non si ripete `when`: `applyWhen(path, ({ valueOf }) => ..., (p) => { ... })` quando i campi esistono sempre e cambia solo se contano (spedizione diversa, newsletter → email obbligatoria); `applyWhenValue(path.cliente, (c): c is Azienda => ..., (azienda) => { ... })` quando cambia la forma dei dati (privato/azienda, carta/bonifico). Test rapido: se la condizione è falsa i campi del blocco esistono ancora nel modello? Sì → `applyWhen`; no → `applyWhenValue`.

### Date

- I limiti di `minDate` e `maxDate` si scrivono in UTC: `new Date('2026-06-01')` o `new Date(Date.UTC(2026, 5, 1))`. Mai `new Date(anno, mese, giorno)` (mezzanotte locale) né `new Date()` diretto (ha un'ora): `<input type="date">` produce sempre la mezzanotte UTC e il limite slitterebbe di qualche ora. «Da oggi in poi» si costruisce con anno, mese e giorno locali ricomposti in UTC (`Date.UTC(oggi.getFullYear(), oggi.getMonth(), oggi.getDate())`).

### Array e sotto-oggetti

- Una regola per ogni elemento di un array: `applyEach(path.items, ItemSchema)`, dove `ItemSchema(item: SchemaPathTree<Item>)` lega le regole ai campi dell'elemento. Per un sotto-oggetto `apply(path.indirizzo, indirizzoSchema)`.

### Personalizzate

- Una regola su un campo si scrive con `validate(path.campo, ({ value }) => ok ? null : { kind: 'nomeRegola' })`: restituisce `null` se il valore va bene, altrimenti un errore con il suo `kind`. Un controllo tra più campi legge gli altri con `valueOf(path.altro)` e si riesegue quando cambia uno dei due.
- Una regola su un gruppo di campi (data di fine dopo quella di inizio, password e conferma uguali) si scrive con `validateTree(path, (ctx) => ...)`: restituisce `{ kind, fieldTree: ctx.fieldTree.conferma }` (o un array di errori) per attaccare l'errore al campo giusto, oppure `null`.
- Una regola che serve in più form si riusa: una funzione che incapsula `validate` (`phoneNumber(path)`) o uno `schema()` condiviso applicato con `apply()`. La validazione sta nello schema del form, non nel controllo.
- Ogni `kind` nuovo ha il suo testo in `common.validation.<kind>` in tutte le lingue (sezione «Campi»).

### Asincrone

- `validateHttp(path.campo, { request, onSuccess, onError })` (o `validateAsync`) parte a ogni cambio di valore, solo dopo che le regole sincrone sono passate. `onSuccess` restituisce un errore con `kind` o `null`; `onError` restituisce un errore proprio (es. `networkError`), così l'utente sa che non è stato possibile verificare.
- Mentre `pending()` è `true` il campo non è ancora valido: il bottone di invio resta disabilitato (come con `submitting()`) e si dice che la verifica è in corso. Per ridurre le richieste: `debounce(path.campo, 300)`.

### Librerie con Standard Schema

- Se il progetto ha già Zod o Valibot, lo schema si collega con `validateStandardSchema(path, schema)`. Non sono installati: aggiungerli lo decide l'utente.

## Template

- `<form [formRoot]="form">`: `FormRoot` imposta da solo `novalidate`, blocca il submit nativo e chiama `submit()`. Non scrivere `novalidate` né `(ngSubmit)`. Va in `imports` del componente del form.
- `FormField` (`[formField]`) lega un campo del template al suo stato in due direzioni e imposta gli attributi nativi: sta solo dentro i controlli di `shared/components/input/`. Il form non lo usa e non aggiunge `[value]`, `[disabled]` o `[required]`: li imposta la direttiva dallo stato.
- Ogni campo del form sta in un componente di `shared/components/input/`, mai in un `<input>`, `<textarea>` o `<select>` scritto a mano nel form. `app-input-text` riceve il campo con `[field]="form.email"` e il suo `<input>` lo lega con `[formField]` (`type` `text` o `email`, `autocomplete` opzionale); `app-input-password` fa lo stesso con `[field]="form.password"`.
- Stato del campo, tutti signal: `value`, `errors`, `valid`, `invalid`, `pending`, `touched`, `dirty`, `disabled`, `submitting`. Errori di tutto il form: `form().errorSummary()`.
- Gli errori compaiono solo dopo l'interazione (`touched() && invalid()`): ci pensa già il controllo.
- Lo stile non si lega a `:valid`, `:invalid`, `validity` o `validationMessage` del browser (con `novalidate` non servono): si collega ai signal di stato.
- Il bottone di invio non si disabilita con `form().invalid()`: l'utente deve poter inviare un form non valido per far comparire gli errori e portare il focus sul primo (`onInvalid`). Si disabilita solo con `form().submitting()`.

## Campi

Ogni campo di un form ha, sempre, tutte e quattro queste cose:

- **Label**: il nome del campo, chiave Transloco (`label="login.email"`).
- **Placeholder**: un esempio o un suggerimento, chiave Transloco (`placeholder="login.emailPlaceholder"`). `placeholder` e `label` sono `input.required()` dei controlli, quindi il build non passa senza.
- **`app-field-wrapper`**: sta dentro ogni controllo (`app-input-*`) e mostra la label e, con `errors` non vuoto, `app-error-message`, con l'`inputId` collegato (`for`, `aria-describedby` sull'id `<inputId>-error`). Il controllo passa `errors` solo se il campo è toccato e non valido (`showError`). Un nuovo tipo di campo (select, checkbox, textarea...) è un componente in `shared/components/input/` che usa `app-field-wrapper`: mai un controllo nudo nel form. Il controllo riceve il campo come `field` (`input.required<FieldTree<string>>()`) e legge `touched` e gli errori da lì (`field()()`); `[formField]` sul suo `<input>` scrive il valore e segna il campo come toccato all'uscita, quindi il controllo non ha `value`, `model()` né `markAsTouched()`.
- **Messaggio d'errore** per ogni validatore dello schema. Il testo è generico e sta in `common.validation.<kind>` (`it.json` e `en.json`), scelto da `app-error-message` (dentro `app-field-wrapper`) dal `kind` dell'errore, e segue il cambio lingua; nel testo `{{ field }}` è il nome del campo (la label) e le proprietà dell'errore (es. `{{ minLength }}`) sono parametri. Un `kind` senza testo usa `common.validation.generic`. Un validatore nuovo (`maxLength`, `pattern`, `validate` con un suo `kind`...) aggiunge la sua chiave in tutte le lingue; non si scrivono messaggi nel singolo form.

## Invio

- `submit(this.form, { action: async (f) => { ... } })` esegue l'azione solo se il form è valido e segna i campi come toccati. Con `form(model, schema, { submission: { action } })` l'azione sta nella definizione e `[formRoot]` la usa da solo. `onInvalid` gestisce il tentativo con form non valido e porta il focus sul primo campo con l'errore (`field().errorSummary()[0]?.fieldTree().focusBoundControl()`, come in `login-form`; regola in `.claude/rules/accessibilita.md`).
- L'azione restituisce `undefined` se va a buon fine, oppure gli errori del server come `{ fieldTree, kind, message }` per mostrarli sul campo giusto. Un errore dell'API che non riguarda un campo (credenziali, server non raggiungibile) va invece in un toast (`ToastService.error('<nome>.summaryKo', '<nome>.detailKo')`) e l'azione restituisce `undefined`: un errore sul campo blocca un nuovo invio finché non si modifica il valore.
- Mentre l'azione è in corso `form().submitting()` è `true`: usalo per disabilitare il bottone di invio.

## Test

- Un test legge e scrive il modello (`model.set(...)`) o il valore del campo (`form.email().value.set(...)`) e controlla `invalid()`/`errors()`, poi l'HTML dopo `await fixture.whenStable()` (regole in `.claude/rules/test.md`).
- Ogni regola personalizzata ha i suoi test: un valore valido, uno non valido (con il `kind` atteso) e, se condizionale, il caso in cui non si applica.
