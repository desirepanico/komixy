# Tema e stile

Le regole operative sono in `.claude/rules/stile.md`. Qui il contesto.

## Dove sta cosa

- `src/tailwind.css`: tema Tailwind (`@theme`), con i colori `primary-*`, `surface-*`, `neutral-*`, `violet-*`, i raggi `--radius-*` e il font `Mulish`.
- `public/theme/theme.css`: token, font, colore base del testo (`surface-100` sul `body`), colore dell'alt delle immagini che non caricano (`surface-400`), sfondo dell'app e focus ring.
- `public/theme/glass.css`: effetto "glass".
- `public/theme/page-transition.css`: transizione tra le pagine su mobile/tablet (view transition).
- `src/styles.css`: entry degli stili globali. Importa i file di `public/theme/` e poi `tailwind.css`.

## Come funziona la cartella `public/theme/`

- È CSS globale, non legato a un componente (per lo stile dei componenti si usa Tailwind nel template, vedi `.claude/rules/stile.md`).
- Ogni file tratta un solo argomento (token e sfondo, glass, transizione di pagina), con un commento d'intestazione che spiega a cosa serve.
- I file non si caricano da soli: vanno importati in `src/styles.css` con `@import '../public/theme/<nome>.css';`, prima di `./tailwind.css`. Un file nuovo non importato non ha effetto.
- Un nuovo argomento globale va in un file nuovo della cartella, non in coda a `theme.css`.

### `page-transition.css`

- Anima il passaggio tra le pagine principali con la View Transitions API, solo sotto i 1024px (mobile e tablet). Da 1024px in su la pagina cambia senza animazione.
- La pagina ha `view-transition-name: page` e la nav in basso `mobile-nav` (resta ferma): sono impostati in `core/layout/layout.html` e `mobile-bottom-nav.html`.
- La direzione arriva da `<html data-nav-direction="forward|back">`, impostato da `core/navigation/nav-direction.ts`. Con `forward` la pagina esce a sinistra ed entra da destra, con `back` il contrario (200 ms, spostamento di 24px con dissolvenza).
- Lo sfondo (`root`) cambia subito, anima solo la pagina.
- Con `prefers-reduced-motion: reduce` tutte le animazioni della view transition sono disattivate.

## Tema

Tema scuro viola. Il testo secondario non scende sotto `surface-500` per rispettare il contrasto (vedi `.claude/rules/accessibilita.md`).

## Come aggiungere un valore

1. Usa un token del tema.
2. Se manca, usa la scala o i colori di default di Tailwind.
3. Se lo stesso valore serve in più punti, aggiungilo al tema in `@theme`.
4. Il valore arbitrario (`p-[13px]`) solo se nessun valore di Tailwind va bene e serve in un solo punto.
