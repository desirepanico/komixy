---
paths:
  - "src/app/**/*.ts"
  - "src/app/**/*.html"
---

# Campi dei form (`shared/components/input/`)

Come si scrive un campo dentro un form. Le regole dei Signal Forms (schema, validazione, invio) sono in `.claude/rules/form.md`.

## Quale componente usare

- Ogni campo sta in un componente di `shared/components/input/`, mai in un `<input>`, `<textarea>` o `<select>` scritto a mano nel form.
- `app-input-text` riceve il campo con `[field]="form.email"` (`type` `text` o `email`, `autocomplete` opzionale); `app-input-password` con `[field]="form.password"`.
- Non aggiungere `[value]`, `[disabled]` o `[required]`: li imposta la direttiva `FormField` dallo stato. `FormField` (`[formField]`) si usa solo dentro i controlli, mai nel form.

## Cosa ha ogni campo

Ogni campo di un form ha, sempre, tutte e quattro queste cose:

- **Label**: il nome del campo, chiave Transloco (`label="login.email"`).
- **Placeholder**: un esempio o un suggerimento, chiave Transloco (`placeholder="login.emailPlaceholder"`). `placeholder` e `label` sono `input.required()` dei controlli, quindi il build non passa senza.
- **`app-field-wrapper`**: sta dentro ogni controllo (`app-input-*`) e mostra la label e, con `errors` non vuoto, `app-error-message`, con l'`inputId` collegato (`for`, `aria-describedby` sull'id `<inputId>-error`).
- **Messaggio d'errore** per ogni validatore dello schema. Il testo è generico e sta in `common.validation.<kind>` (`it.json` e `en.json`), scelto da `app-error-message` dal `kind` dell'errore, e segue il cambio lingua; nel testo `{{ field }}` è il nome del campo (la label) e le proprietà dell'errore (es. `{{ minLength }}`) sono parametri. Un `kind` senza testo usa `common.validation.generic`. Un validatore nuovo aggiunge la sua chiave in tutte le lingue; non si scrivono messaggi nel singolo form.

## Come è fatto un controllo

- Riceve il campo come `field` (`input.required<FieldTree<string>>()`), legge `touched` ed errori da lì (`field()()`) e passa `errors` al wrapper solo se il campo è toccato e non valido (`showError`).
- `[formField]` sul suo `<input>` scrive il valore e segna il campo come toccato all'uscita: il controllo non ha `value`, `model()` né `markAsTouched()`.
- Un nuovo tipo di campo (select, checkbox, textarea...) è un componente in `shared/components/input/` che usa `app-field-wrapper`: mai un controllo nudo nel form.
