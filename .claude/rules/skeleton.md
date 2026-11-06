---
paths:
  - "src/**/*.html"
  - "src/index.html"
---

# Regole sugli skeleton

- Un contenuto che arriva in ritardo (immagini remote, dati da una richiesta) mostra uno skeleton al suo posto, non un vuoto né un salto di layout. Si usa `app-skeleton` (`shared/components/skeleton`): non riscrivere `animate-pulse` e `bg-surface-800` nelle pagine.
- Lo skeleton ha le stesse misure del contenuto vero (le classi di larghezza, altezza e raggio vanno sul tag `app-skeleton` o sul suo contenitore), così quando il contenuto arriva nulla si sposta.
- Si mostra con `@if` su un signal (`loaded`, `loading`) e sparisce quando il contenuto è pronto, anche in caso di errore: non resta mai acceso.
- È solo decorativo (`aria-hidden`, già nel componente). Se serve annunciare il caricamento, lo fa il contenitore con `aria-busy`.
- Non serve sulle pagine con contenuto statico o già in memoria (es. i segnaposto con `app-empty-state`): lo skeleton si aggiunge quando compare un caricamento vero.
- Lo skeleton di avvio in `src/index.html` è HTML puro perché Angular non è ancora partito: usa gli stessi token (`bg-surface-800`) e la stessa animazione; la sua guida è nel commento in quel file.
