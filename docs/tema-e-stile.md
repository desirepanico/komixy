# Tema e stile

Le regole operative sono in `.claude/rules/stile.md`. Qui il contesto.

## Dove sta cosa

- `src/tailwind.css`: tema Tailwind (`@theme`), solo con ciò che serve a più punti dell'app: i colori `primary-*`, `surface-*`, `neutral-*`, `violet-*`, i raggi `--radius-*`, il font `Mulish` e il breakpoint `xs` (360px: sotto questa soglia, cioè sui telefoni più stretti, le card della classifica si stringono; si usa come `xs:`). I `@keyframes` usati da un solo componente non stanno qui ma nel suo `.css` (`login-volumes.css` per i volumi della login, `comic-rank-card.css` per il numero in classifica); l'animazione si applica nel template con `animate-[...]` e `prefers-reduced-motion` si gestisce lì con `motion-reduce:` / `motion-safe:`.
- `public/theme/theme.css`: token, font, colore base del testo (`surface-100` sul `body`), colore dell'alt delle immagini che non caricano (`surface-400`), sfondo dell'app e focus ring.
- `public/theme/glass.css`: effetto "glass".
- `public/theme/page-transition.css`: transizione tra le pagine su mobile/tablet (view transition).
- `public/theme/autofill.css`: i campi compilati dai suggerimenti del browser restano del colore del tema (il browser li colora di azzurro e mette il testo nero).
- `src/styles.css`: entry degli stili globali. Importa i file di `public/theme/` e poi `tailwind.css`.

## Come funziona la cartella `public/theme/`

- È CSS globale, non legato a un componente (per lo stile dei componenti si usa Tailwind nel template, vedi `.claude/rules/stile.md`).
- Ogni file tratta un solo argomento (token e sfondo, glass, transizione di pagina).
- I file non si caricano da soli: vanno importati in `src/styles.css` con `@import '../public/theme/<nome>.css';`, prima di `./tailwind.css`. Un file nuovo non importato non ha effetto.
- Un nuovo argomento globale va in un file nuovo della cartella, non in coda a `theme.css`.

### `page-transition.css`

- Anima il passaggio tra le pagine principali con la View Transitions API, solo sotto i 1024px (mobile e tablet). Da 1024px in su la pagina cambia senza animazione.
- La pagina ha `view-transition-name: page` e la nav in basso `mobile-nav` (resta ferma): sono impostati in `core/layout/layout.html` e `mobile-bottom-nav.html`.
- La direzione arriva da `<html data-nav-direction="forward|back">`, impostato da `core/providers/nav-direction/nav-direction.provider.ts`. Con `forward` la pagina esce a sinistra ed entra da destra, con `back` il contrario (200 ms, spostamento di 24px con dissolvenza).
- Lo sfondo (`root`) cambia subito, anima solo la pagina.
- Con `prefers-reduced-motion: reduce` tutte le animazioni della view transition sono disattivate.

## Tema

Tema scuro viola. Il testo secondario deve rispettare il contrasto WCAG AA, che dipende dallo sfondo: `surface-500` regge solo su `surface-900` e `surface-950` (vedi `.claude/rules/accessibilita.md`).

## Come aggiungere un valore

1. Usa un token del tema.
2. Se manca, usa la scala o i colori di default di Tailwind.
3. Se lo stesso valore serve in più punti, aggiungilo al tema in `@theme`.
4. Il valore arbitrario (`p-[13px]`) solo se nessun valore di Tailwind va bene e serve in un solo punto.

## Editor (VS Code)

`.vscode/extensions.json` consiglia l'estensione «Tailwind CSS IntelliSense» (`bradlc.vscode-tailwindcss`) e `.vscode/settings.json` la configura: legge il tema da `src/tailwind.css` e segnala come avviso le classi non canoniche (es. `w-[3rem]` invece di `w-12`), i conflitti tra classi e l'ordine non consigliato delle varianti. Il fix rapido (la lampadina) le corregge. Le regole di scrittura restano in `.claude/rules/stile.md`.
