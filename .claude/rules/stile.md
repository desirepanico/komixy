---
paths:
  - 'src/**/*.html'
  - 'src/**/*.css'
---

# Regole di stile (Tailwind e tema)

- Colori: usa prima i token del tema in `src/styles/theme.css` (`primary-*`, `surface-*`, `neutral-*`, `violet-*`). Se il colore non esiste tra i token, usa un colore di default di Tailwind (es. `red-500`, `white`).
- Se un colore di Tailwind è usato in più punti, aggiungilo al tema come token in `@theme` (`--color-<nome>`) e usa quello. Il valore arbitrario (es. `bg-[#1a1a2e]`) solo se nessun colore di Tailwind va bene e serve in un solo punto.
- Spaziature (`p-*`, `m-*`, `gap-*`, `w-*`, `h-*`, ...): usa la scala di Tailwind (es. `p-4`, `gap-2`). Il valore arbitrario (es. `p-[13px]`) solo se la scala non ha un valore adatto e serve in un solo punto; se è usato in più punti, aggiungi un token in `@theme` (`--spacing-*`) e usa quello.
- Stessa regola per le altre scale di Tailwind (font size, shadow, z-index, ...): prima il tema, poi la scala di default di Tailwind; valore arbitrario solo se nessun valore va bene e serve in un solo punto; token in `@theme` se è usato in più punti.
- Nei file CSS usa `var(--color-<nome>)`.
- Raggi dei bordi con le classi `rounded-*` (i valori sono definiti in `@theme` come `--radius-*`).
- Niente classi CSS globali per i componenti: stile con Tailwind dentro il componente. Il CSS globale resta in `src/styles/` (`theme.css`, `animations.css`, `overrides.css`).
- Se lo stesso markup compare, o sta per comparire, in più pagine o feature, non copiarlo: crea un componente shared con la skill `shared-component` e importalo (es. `app-tag`, `appButton`, `app-empty-state`).
- Liste che scorrono in orizzontale: usa sempre `app-horizontal-scroller` (scroll nativo, snap, frecce, accessibilità), non riscrivere la logica nella pagina.
- Icone solo con `ng-icon`. Niente `pi pi-*`.

## I file dello stile

- `src/styles.css`: il file d'ingresso, registrato in `angular.json`. Contiene solo gli `@import` (`tailwindcss` per primo, poi i tre file sotto) e `@custom-variant dark`: nessuna regola. Un file nuovo va importato qui, altrimenti non ha effetto.
- `src/styles/theme.css`: il design system (`@theme static`: font, breakpoint, raggi, palette), il `@font-face`, gli stili di partenza in `@layer base` (`:root`, `body`, `img`, sfondo) e le `@utility` globali (`glass-strong`, `scrollbar-none`), senza titoli di sezione. Il tema contiene solo il design system: se ci finisce altro, va in un'altra parte.
- `src/styles/animations.css`: le animazioni usate da due o più componenti (`@theme` e `@keyframes`) e la transizione tra le pagine.
- `src/styles/overrides.css`: le correzioni ai browser che devono battere le utility di Tailwind (oggi il riempimento automatico), fuori dai layer.

## Dove va uno stile

| Cosa                                                                | Dove                                                            |
| ------------------------------------------------------------------- | --------------------------------------------------------------- |
| Valore del design system (colore, raggio, font, breakpoint)         | `src/styles/theme.css`, sezione Tema                            |
| Animazione usata da due o più componenti, transizione tra le pagine | `src/styles/animations.css`                                     |
| CSS globale non legato a un componente (font, sfondo, glass)        | `src/styles/theme.css`, `@layer base` e `@utility`              |
| Correzione a un browser che deve battere le utility (autofill)      | `src/styles/overrides.css`, fuori dai layer                     |
| Animazione o `@keyframes` di un solo componente                     | il `.css` del componente (`styleUrl`, `ViewEncapsulation.None`) |
| Layout, colori, spaziature                                          | classi Tailwind nel template                                    |

- **Il `.css` di un componente c'è solo se serve**: per `@keyframes` suoi o per regole che Tailwind non esprime. Un componente senza queste cose non ha `styleUrl` né un file vuoto. Tutto il resto segue la tabella e i file qui sopra.
- Un'animazione nasce nel componente che la usa e passa in `src/styles/animations.css` solo quando una seconda parte la usa.
- Gli stili di partenza su elementi e `:root` stanno in `@layer base` di `theme.css`; ciò che deve battere le utility di Tailwind (come il riempimento automatico) va in `overrides.css`, fuori dai layer.
- Una classe globale (come `glass-strong`) è una `@utility` in `theme.css`, così funziona con le varianti (`md:glass-strong`); non si dichiara se nessun template la usa.
- Il font (`@font-face` in `theme.css`) non ha `font-display`: il file è già precaricato in `index.html`.
- `@keyframes` di un componente: nome col prefisso del componente (`comic-rank-card-in`), perché con `ViewEncapsulation.None` sono globali. Nel template la classe è `animate-[nome_durata_easing]`, che tiene valide le varianti (`motion-safe:`, `data-in-view:`). Dove serve una classe con nome (`animate.leave`, `[class.x]`) la si definisce nel `.css` del componente e si aggiunge il suo prefisso a `no-unknown-classes` in `eslint.config.js`.
- Un valore che serve sia al CSS sia a TypeScript ha un solo posto: il CSS; il TypeScript lo legge da lì o lo dichiara come costante con il rimando.
