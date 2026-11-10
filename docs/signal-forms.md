# Signal Forms

Spiegazioni che stanno dietro le regole di `.claude/rules/form.md` (Signal Forms) e `.claude/rules/campi-form.md` (campi), che qui non si ripetono. Come funzionano i Signal Forms in generale: <https://angular.dev/guide/forms/signals/overview> e <https://angular.dev/guide/forms/signals/validation>. Il form di riferimento è `features/auth/components/login-form`.

## Come si compone un campo

Nel template il form non ha `<input>`: ogni campo è un controllo di `shared/components/input/` e ogni controllo ha lo stesso scheletro.

```
app-input-text / app-input-password   riceve il campo con [field], lo lega al suo <input> con [formField]
└── app-field-wrapper                  label + id collegati (for, aria-describedby)
    └── app-error-message              primo errore, solo se il campo è toccato e non valido
```

L'errore parte dallo schema come `kind` (`required`, `minLength`...). `app-error-message` lo traduce con `common.validation.<kind>` e il nome del campo, quindi lo stesso testo vale per tutti i form (vedi `docs/traduzioni.md`). Le regole sono indipendenti e non si fermano al primo errore, ma il controllo ne mostra uno solo.

## Perché `novalidate`

Senza `novalidate` il browser valida per conto suo, annulla l'invio e mostra la sua bolla, ignorando le regole solo di Angular (`pattern`, personalizzate, asincrone). `FormRoot` lo aggiunge da solo, quindi `submit` parte sempre e decide Angular: se il form è invalido segna i campi come toccati e mostra i suoi errori, altrimenti esegue l'azione.

## Perché le date vanno in UTC

`<input type="date">` non ha un'ora, ma una `Date` sì: il browser usa sempre la mezzanotte UTC. Un limite con `new Date(2026, 5, 1)` è la mezzanotte locale e slitta di qualche ora, quindi la data limite stessa può essere rifiutata; `new Date()` ha l'ora corrente e rifiuterebbe come passata la data di oggi.
