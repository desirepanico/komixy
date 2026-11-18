# Tema e stile

Le regole operative sono in `.claude/rules/stile.md`. Qui il contesto.

## Dove sta cosa

Il CSS globale sta in tre file:

- `src/styles.css`: il file d'ingresso, registrato in `angular.json` (`styles`). Contiene solo `@import 'tailwindcss'`, gli import dei due file sotto e la variante `dark` (`@custom-variant`). Nessuna regola.
- `src/styles/theme.css`: tema e base, in sezioni con l'intestazione `/* ─── Nome ─── */`.
  - **Tema** (`@theme static`): il design system. Colori `primary-*`, `surface-*`, `neutral-*`, `violet-*`, raggi `--radius-*`, font `Mulish` e breakpoint `xs` (360px: sotto questa soglia, sui telefoni più stretti, le card della classifica si stringono; si usa come `xs:`).
  - **Font, Pagina, Sfondo**: `@font-face`, colore del testo e alt delle immagini, sfondo viola dell'app.
  - **Effetto vetro, Transizione tra le pagine, Riempimento automatico, Utility**: glass, view transition, autofill del browser e `scrollbar-none`.
- `src/styles/animations.css`: le animazioni usate da due o più componenti (`card-sheen`, `foil`, `bump`), con i loro `@keyframes` (`@theme`).

Le animazioni di un solo componente stanno nel suo `.css` (es. `comic-rank-card.css`, `discover-guide.css`).

## Come si organizza

- È CSS globale solo ciò che non appartiene a un componente; per lo stile dei componenti si usa Tailwind nel template (`.claude/rules/stile.md`, che ha anche la tabella «Dove va uno stile»).
- I file vanno importati in `src/styles.css`: uno nuovo non importato non ha effetto. Un argomento globale nuovo è una sezione di `theme.css`, non un file in più.
- Le custom property dichiarate nel `.css` di un componente sono prefissate da Angular con un namespace (`--x` diventa `--%NS%x`); senza `cssVarNamespace` è vuoto e il nome non cambia. Una variabile di un componente letta dal tema andrebbe dichiarata come `--global--x`.

### Transizione tra le pagine (sezione di `theme.css`)

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
3. Se lo stesso valore serve in più punti ed è del design system, aggiungilo alla sezione Tema di `theme.css`; se è un'animazione, a `animations.css`.
4. Il valore arbitrario (`p-[13px]`) solo se nessun valore di Tailwind va bene e serve in un solo punto.

## Ordine delle classi

Le classi Tailwind nei template si ordinano con `prettier-plugin-tailwindcss`, che legge il tema da `src/styles.css` (opzione `tailwindStylesheet` nella configurazione Prettier di `package.json`). Come lanciarlo: `docs/sviluppo.md`, sezione «Formattazione».
