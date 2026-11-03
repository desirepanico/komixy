---
paths:
  - "src/app/**/*.html"
  - "src/app/**/*.ts"
---

# Regole di accessibilità

- Devono passare tutti i controlli AXE.
- Rispetta il livello WCAG AA, inclusi gestione del focus, contrasto dei colori e attributi ARIA.
- Contrasto minimo del testo: 4,5 a 1 (3 a 1 per il testo grande). Sul tema scuro il testo secondario non deve scendere sotto `surface-500`.
- Ogni elemento interattivo ha un `focus-visible` ben visibile (es. `focus-visible:outline-2 focus-visible:outline-primary-400`).
- I bottoni con sola icona hanno `aria-label` tradotto con Transloco.
- Gli elementi che navigano sono `<a>` con `routerLink`, quelli che eseguono un'azione sono `<button>`. Mai `<div>` cliccabili senza ruolo e gestione da tastiera.
- Le immagini hanno un `alt` significativo; le decorative `alt=""` o `aria-hidden="true"`.

## Uso da tastiera

Regola generale: tutto ciò che si fa con mouse o touch si deve poter fare anche solo da tastiera (Tab, Maiusc+Tab, Invio, Spazio, frecce, Esc).

- Nessuna funzione solo su hover, swipe, drag o scroll col dito: serve sempre un'alternativa da tastiera (es. lo swipe tra pagine ha la barra di navigazione, la lista orizzontale ha le frecce e i tasti freccia).
- Usa solo elementi nativi interattivi (`<a>`, `<button>`, `<input>`...): si raggiungono con Tab e si attivano con Invio/Spazio senza codice extra. `tabindex="0"` solo per zone che scorrono; mai `tabindex` maggiore di 0.
- Card cliccabile: un solo `<a routerLink>` sul titolo con `after:absolute after:inset-0` e il contenitore `relative`; i bottoni dentro la card (es. segnalibro) hanno `relative z-10`. Mai `<div>` con `routerLink` o `(click)`. Il focus della card si mostra con `has-[a:focus-visible]:`.
- L'ordine di Tab segue l'ordine visivo. Gli elementi nascosti non devono essere raggiungibili (`hidden` o `invisible`, non solo `opacity-0`).
- Se un elemento che ha il focus sparisce o si disabilita (es. freccia a fine lista), sposta il focus su un elemento vicino: il focus non va mai perso.
- Prova ogni nuova pagina o componente usando solo Tab, Invio, Spazio ed Esc.
