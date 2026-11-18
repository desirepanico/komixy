---
paths:
  - 'src/**/*.html'
  - 'src/index.html'
---

# Regole sugli skeleton

- Un contenuto che arriva in ritardo (immagini remote, dati da una richiesta) mostra uno skeleton al suo posto, non un vuoto né un salto di layout. Si usa `app-skeleton` (`shared/components/skeleton`): non riscrivere `animate-pulse` e `bg-surface-800` nelle pagine.
- Lo skeleton ha le stesse misure del contenuto vero (le classi di larghezza, altezza e raggio vanno sul tag `app-skeleton` o sul suo contenitore), così quando il contenuto arriva nulla si sposta.
- Si mostra con `@if` su un signal (`loaded`, `loading`) e sparisce quando il contenuto è pronto, anche in caso di errore: non resta mai acceso.
- Per i dati di una chiamata al backend lo `loading` si accende prima della richiesta e si spegne nel `finally`: esempio completo in `chiamate-api.md`, sezione «Skeleton mentre la chiamata è in corso».
- È solo decorativo (`aria-hidden`, già nel componente). Se serve annunciare il caricamento, lo fa il contenitore con `aria-busy`.
- Non serve sulle pagine con contenuto statico o già in memoria (es. i segnaposto con `app-empty-state`): lo skeleton si aggiunge quando compare un caricamento vero.
- Lo skeleton di avvio in `src/index.html` è HTML puro perché Angular non è ancora partito: usa gli stessi token (`bg-surface-800`) e la stessa animazione; sta fuori da `<app-root>` e lo toglie `provideBootSkeleton()` dopo la prima navigazione; la sua guida è nel commento in quel file.
- **Ha una variante per ogni tipo di pagina** (`data-variant`, scelta dall'indirizzo dallo script sotto lo skeleton) e due attributi di stato, `data-guest` e `data-pack`, letti dallo storage come fa l'app: le pagine che cambiano con l'ospite o con la busta (Scopri, Classifica, dettaglio) hanno un blocco per ogni caso. Le misure si prendono dai template veri (stesse classi, righe alte quanto il testo con `h-lh`), non a occhio, e si confrontano con la pagina vera a più larghezze.
- Una pagina nuova, o una che cambia struttura, aggiorna lo skeleton nello stesso commit: blocco in `index.html`, rotta nello script e riga in `scripts/check-skeleton.mjs`, che gira in `npm run lint` e rifiuta una rotta senza skeleton suo.
