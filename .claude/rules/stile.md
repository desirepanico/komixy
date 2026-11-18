---
paths:
  - 'src/**/*.html'
  - 'src/**/*.css'
---

# Regole di stile (Tailwind e tema)

- Colori: usa prima i token del tema in `src/styles.css` (`primary-*`, `surface-*`, `neutral-*`, `violet-*`). Se il colore non esiste tra i token, usa un colore di default di Tailwind (es. `red-500`, `white`).
- Se un colore di Tailwind è usato in più punti, aggiungilo al tema come token in `@theme` (`--color-<nome>`) e usa quello. Il valore arbitrario (es. `bg-[#1a1a2e]`) solo se nessun colore di Tailwind va bene e serve in un solo punto.
- Spaziature (`p-*`, `m-*`, `gap-*`, `w-*`, `h-*`, ...): usa la scala di Tailwind (es. `p-4`, `gap-2`). Il valore arbitrario (es. `p-[13px]`) solo se la scala non ha un valore adatto e serve in un solo punto; se è usato in più punti, aggiungi un token in `@theme` (`--spacing-*`) e usa quello.
- Stessa regola per le altre scale di Tailwind (font size, shadow, z-index, ...): prima il tema, poi la scala di default di Tailwind; valore arbitrario solo se nessun valore va bene e serve in un solo punto; token in `@theme` se è usato in più punti.
- Nei file CSS usa `var(--color-<nome>)`.
- Raggi dei bordi con le classi `rounded-*` (i valori sono definiti in `@theme` come `--radius-*`).
- Niente classi CSS globali per i componenti: stile con Tailwind dentro il componente. Il CSS globale resta in `src/styles/` (`theme.css`, `animations.css`).
- Se lo stesso markup compare, o sta per comparire, in più pagine o feature, non copiarlo: crea un componente shared con la skill `shared-component` e importalo (es. `app-tag`, `appButton`, `app-empty-state`).
- Liste che scorrono in orizzontale: usa sempre `app-horizontal-scroller` (scroll nativo, snap, frecce, accessibilità), non riscrivere la logica nella pagina.
- Icone solo con `ng-icon`. Niente `pi pi-*`.

## Dove va uno stile

| Cosa                                                                                          | Dove                                                            |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Valore del design system (colore, raggio, font, breakpoint)                                   | `src/styles/theme.css`, sezione Tema                            |
| Animazione usata da due o più componenti                                                      | `src/styles/animations.css`                                     |
| CSS globale non legato a un componente (font, sfondo, glass, transizione di pagina, autofill) | `src/styles/theme.css`, altre sezioni                           |
| Animazione o `@keyframes` di un solo componente                                               | il `.css` del componente (`styleUrl`, `ViewEncapsulation.None`) |
| Layout, colori, spaziature                                                                    | classi Tailwind nel template                                    |

- Un'animazione nasce nel componente che la usa e passa in `src/styles/animations.css` solo quando una seconda parte la usa.
- `@keyframes` di un componente: nome col prefisso del componente (`comic-rank-card-in`), perché con `ViewEncapsulation.None` sono globali. Nel template la classe è `animate-[nome_durata_easing]`, che tiene valide le varianti (`motion-safe:`, `data-in-view:`). Dove serve una classe con nome (`animate.leave`, `[class.x]`) la si definisce nel `.css` del componente e si aggiunge il suo prefisso a `no-unknown-classes` in `eslint.config.js`.
- Un valore che serve sia al CSS sia a TypeScript ha un solo posto: il CSS; il TypeScript lo legge da lì o lo dichiara come costante con il rimando.
- `src/styles.css` contiene solo gli `@import` (con `tailwindcss` per primo) e `@custom-variant`: nessuna regola. `theme.css` è in sezioni con l'intestazione `/* ─── Nome ─── */`; la sezione Tema contiene solo il design system, e se ci finisce altro va in un'altra sezione.
