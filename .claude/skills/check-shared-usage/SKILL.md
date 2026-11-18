---
name: check-shared-usage
description: Verifica che pagine, componenti di feature e core usino i componenti di src/app/shared/components invece di ricrearli da zero (bottoni, link, tag, messaggi, segnaposto, skeleton, liste orizzontali), poi propone o applica le sostituzioni. Usare quando l'utente chiede di controllare il riuso dei componenti shared, di cercare duplicati nei template o dopo aver aggiunto markup nuovo.
argument-hint: [cartella o file da controllare] [--fix]
---

# Controlla l'uso dei componenti shared

Argomento: `$ARGUMENTS` (vuoto = tutto `src/app` fuori da `shared/`; `--fix` = applica anche le sostituzioni).

Componenti shared ora (selector da `@Component`):

!`cd src/app/shared/components && for d in */; do d=${d%/}; [ -f $d/$d.ts ] && echo "- $d: $(grep -m1 -o "selector: '[^']*'" $d/$d.ts | cut -d"'" -f2)"; done`

Campi di form: `shared/components/input/` (`input-text`, `input-password`, regola in `.claude/rules/form.md`).

## 1. Cerca i candidati

Guarda solo i `.html` (e i template inline) fuori da `src/app/shared/`. Un tag su più righe va letto per intero: un `grep` per riga non basta.

- **Bottoni e link-bottone**: ogni `<button>` e `<a>` senza `appButton` / `appToggleButton`. Con `appButton` si coprono `filled`/`outlined`/`text`, `severity`, `iconOnly`, `rounded` e `underline` (link nel testo: `variant="text" [underline]="true"`).
- **Pillole e badge**: `rounded-full` con `px-*`/`py-*` e testo piccolo → `app-tag`.
- **Avvisi**: elementi con `role="alert"` / `role="status"` e bordo/sfondo colorati, o testo con link d'invito → `app-message` (il contenuto proiettato resta nel messaggio).
- **Stati vuoti** (icona + titolo + descrizione) → `app-empty-state`; **caricamenti** con `animate-pulse` → `app-skeleton`.
- **Liste orizzontali** con `overflow-x-auto` → `app-horizontal-scroller`.
- **Segmentati** (gruppo di pulsanti `aria-pressed` con solo testo) → `app-select-button`; **bottone icona a due stati** → `appToggleButton`.
- **Segnalibro, card di fumetto, carte, marchio** (`app-bookmark-button`, `app-comic-card`, `app-pack-card`, `app-card-*`, `app-brand`): se il markup replica queste cose, usa il componente.
- **Campi**: `<input>`, `<select>`, `<textarea>`, `<label>` con `formField` senza `app-input-*` / `app-field-wrapper`.

## 2. Decidi caso per caso

Sostituisci quando il componente copre il caso con le sue varianti. **Non** sostituire se:

- serve un layout che il componente non permette (dimensioni fisse diverse, `md:flex-wrap` dove lo scroller non va a capo, switch con `role="switch"`, schede con contenuto complesso): è un caso particolare, lascialo e annotalo;
- l'elemento è un bottone-card o una voce di navigazione con stato `aria-current` (sidebar, barra mobile).

Se manca una variante, non aggirarla con classi Tailwind: proponi di estendere il componente con la skill `shared-component`. Se lo stesso markup compare in due punti e non esiste il componente, crealo con `shared-component`.

## 3. Applica (solo con `--fix` o se l'utente lo chiede)

Per ogni sostituzione segui la skill `use-shared`: import con alias `@shared/components/<nome>/<nome>` in `imports`, selector reale, input obbligatori, testi in Transloco, accessibilità invariata (`aria-*`, `focus-visible`). Togli gli import che restano inutilizzati e aggiorna gli spec che cercavano le vecchie classi.

## 4. Riepilogo e verifica

Riporta una tabella: file:riga → componente usato/proposto → fatto / lasciato (con il motivo). Poi `npm run lint`, `npm run knip`, `npm test -- --no-watch`, `npm run build`. Niente commit senza ok esplicito (`.claude/rules/git.md`).
