---
paths:
  - "src/**/*.html"
  - "src/**/*.ts"
---

# Regole di accessibilità

- Devono passare tutti i controlli AXE.
- Rispetta il livello WCAG AA, inclusi gestione del focus, contrasto dei colori e attributi ARIA.
- Contrasto minimo del testo: 4,5 a 1 (3 a 1 per il testo grande). Sul tema scuro il testo secondario non deve scendere sotto `surface-500`.
- Ogni elemento interattivo ha un `focus-visible` ben visibile (es. `focus-visible:outline-2 focus-visible:outline-primary-400`).
- I bottoni con sola icona hanno `aria-label` tradotto con Transloco.
- Gli elementi che navigano sono `<a>` con `routerLink`, quelli che eseguono un'azione sono `<button>`. Mai `<div>` cliccabili senza ruolo e gestione da tastiera.
- Le immagini hanno un `alt` significativo; le decorative `alt=""` o `aria-hidden="true"`.
