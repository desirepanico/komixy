# Signal Forms

Come funzionano i Signal Forms (`@angular/forms/signals`) e perché le regole del progetto sono quelle. Le **regole** sono in `.claude/rules/form.md` (Signal Forms) e `.claude/rules/campi-form.md` (campi) e qui non si ripetono. Guide: <https://angular.dev/guide/forms/signals/validation> e <https://angular.dev/guide/forms/signals/comparison>. Il form di riferimento è `features/auth/components/login-form`.

## Le tre parti

- **Modello**: un `signal()` con i dati. Non contiene regole.
- **Schema**: la funzione passata come secondo argomento di `form(model, schema)`. Gira una sola volta e riceve i percorsi dei campi (`path.email`), riferimenti al campo e non il campo stesso. Qui stanno le regole.
- **Template**: due direttive collegano lo schema all'HTML.

| | `FormField` | `FormRoot` |
|---|---|---|
| Si mette su | un campo (`<input>`, `<select>`, componente custom) | il `<form>` |
| Collega | il campo del template al suo stato nel form | l'intero form all'evento di invio |
| Sintassi | `[formField]="form.email"` | `[formRoot]="form"` |
| Nei Reactive Forms | `[formControl]` / `formControlName` | `[formGroup]` |

`FormField` mostra il valore del modello, lo aggiorna quando l'utente scrive, aggiorna lo stato (`touched`, `dirty`...) e sugli elementi nativi imposta gli attributi (`required`, `min`, `maxlength`...). Non è un `FormControl`: non contiene i dati, è solo il legame.

## Come funziona la validazione

1. Le regole **sincrone** (`required`, `email`, `validate`...) girano a ogni cambio di valore.
2. Le regole **asincrone** (`validateHttp`) girano solo dopo che tutte le sincrone sono passate. Finché aspettano `pending()` è `true` e `valid()` è `false`.
3. Poi si aggiornano `valid()`, `invalid()`, `errors()` e `pending()`.

Le regole sono indipendenti e non si fermano al primo errore: un campo vuoto ha solo `required`, `a@b` ha sia `email` sia `minLength`. `app-error-message` mostra il primo.

## Perché `novalidate`

Senza `novalidate` il browser valida per conto suo, annulla l'invio e mostra la sua bolla, ignorando le regole solo di Angular (`pattern`, personalizzate, asincrone). `FormRoot` lo aggiunge da solo, quindi `submit` parte sempre e decide Angular: se il form è invalido segna i campi come toccati e mostra i suoi errori, altrimenti esegue l'azione.

## Perché le date vanno in UTC

`<input type="date">` non ha un'ora, ma una `Date` sì: il browser usa sempre la mezzanotte UTC. Un limite con `new Date(2026, 5, 1)` è la mezzanotte locale e slitta di qualche ora, quindi la data limite stessa può essere rifiutata; `new Date()` ha l'ora corrente e rifiuterebbe come passata la data di oggi.

## Come si compone un campo

Nel template il form non ha `<input>`: ogni campo è un controllo di `shared/components/input/` e ogni controllo ha lo stesso scheletro.

```
app-input-text / app-input-password   riceve il campo con [field], lo lega al suo <input> con [formField]
└── app-field-wrapper                  label + id collegati (for, aria-describedby)
    └── app-error-message              primo errore, solo se il campo è toccato e non valido
```

L'errore parte dallo schema come `kind` (`required`, `minLength`...). `app-error-message` lo traduce con `common.validation.<kind>` e il nome del campo, quindi lo stesso testo vale per tutti i form (vedi `docs/traduzioni.md`).
