# Signal Forms

Come funzionano i Signal Forms (`@angular/forms/signals`) e perché le regole del progetto sono quelle. Le **regole** sono in `.claude/rules/form.md` e qui non si ripetono. Guide: <https://angular.dev/guide/forms/signals/validation> e <https://angular.dev/guide/forms/signals/comparison>.

## Le tre parti

- **Modello**: un `signal()` con i dati. Non contiene regole.
- **Schema**: la funzione passata come secondo argomento di `form(model, schema)`. Gira una sola volta e riceve i percorsi dei campi (`path.email`), riferimenti al campo e non il campo stesso. Qui stanno tutte le regole.
- **Template**: due direttive collegano lo schema all'HTML.

| | `FormField` | `FormRoot` |
|---|---|---|
| Si mette su | un campo (`<input>`, `<select>`, componente custom) | il `<form>` |
| Collega | il campo del template al suo stato nel form | l'intero form all'evento di invio |
| Sintassi | `[formField]="form.email"` | `[formRoot]="form"` |
| Nei Reactive Forms corrisponde a | `[formControl]` / `formControlName` | `[formGroup]` |

`FormField` mostra il valore del modello, lo aggiorna quando l'utente scrive, aggiorna lo stato (`touched`, `dirty`...) e sugli elementi nativi imposta gli attributi (`required`, `min`, `maxlength`...). Non è un `FormControl`: non contiene i dati, è solo il legame. In Komixy sta dentro i componenti di `shared/components/input/`.

## Come funziona la validazione

1. Le regole **sincrone** (`required`, `email`, `validate`...) girano a ogni cambio di valore, con esito immediato.
2. Le regole **asincrone** (`validateHttp`) girano solo dopo che tutte le sincrone sono passate (con `required` fallito non parte nessuna richiesta). Finché aspettano `pending()` è `true` e `valid()` è `false`.
3. Poi si aggiornano `valid()`, `invalid()`, `errors()` e `pending()`.

Le regole sono indipendenti e non si fermano al primo errore: un campo vuoto ha solo `required`, `a@b` ha sia `email` sia `minLength`. `app-error-message` mostra il primo.

## Perché `novalidate`

Senza `novalidate` il browser valida per conto suo (`required`, `min`, `maxlength`...), annulla l'invio e mostra la sua bolla, ignorando le regole solo di Angular (`pattern`, regole personalizzate e asincrone). `FormRoot` lo aggiunge da solo, quindi `submit` parte sempre e decide Angular: se il form è invalido segna i campi come toccati e mostra i suoi errori, altrimenti esegue l'azione. Per questo il codice non usa `:valid`, `:invalid`, `validity` o `validationMessage`.

## Perché le date vanno in UTC

`<input type="date">` non ha un'ora, ma una `Date` sì: il browser usa sempre la mezzanotte UTC. Un limite creato con `new Date(2026, 5, 1)` è la mezzanotte locale e slitta di qualche ora, quindi la data limite stessa può essere rifiutata. `new Date()` è l'istante corrente (oggi alle 15:30), mentre la data scelta oggi vale oggi alle 00:00 UTC e sarebbe rifiutata come passata.

## Regole su più campi

`validate` vede un solo campo (e legge gli altri con `valueOf`); `validateTree` si applica a un nodo più alto, vede tutti i campi figli e sceglie a quale campo attaccare l'errore con `fieldTree`. Serve per «data di fine dopo quella di inizio» e «password e conferma uguali».

## Esempio: il form di login di Komixy

`features/auth/components/login-form` mette insieme le parti: modello e schema nel componente, `FormRoot` sul `<form>`, un controllo di `shared/components/input/` per campo, `submission.action` per l'invio e `onInvalid` per il focus.

```ts
private readonly model = signal<LoginCredentials>({ email: '', password: '' });

protected readonly form = form(
  this.model,
  (path) => {
    required(path.email);
    email(path.email);
    required(path.password);
    minLength(path.password, PASSWORD_MIN_LENGTH);
  },
  {
    submission: {
      action: () => new Promise<TreeValidationResult>((resolve) => { /* ... */ }),
      onInvalid: (field) => field().errorSummary()[0]?.fieldTree().focusBoundControl(),
    },
  },
);
```

```html
<form [formRoot]="form">
  <app-input-text label="login.email" inputId="login-email" type="email"
    placeholder="login.emailPlaceholder" [field]="form.email" />
  <app-input-password label="login.password" inputId="login-password"
    placeholder="login.passwordPlaceholder" [field]="form.password" />
  <button appButton type="submit" [disabled]="form().submitting()">...</button>
</form>
```

I messaggi d'errore non stanno nello schema: li sceglie `app-error-message` dal `kind` (`common.validation.<kind>`, vedi `docs/traduzioni.md`).
