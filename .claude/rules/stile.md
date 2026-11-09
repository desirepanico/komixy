---
paths:
  - "src/**/*.html"
  - "src/**/*.css"
  - "public/theme/**"
---

# Regole di stile (Tailwind e tema)

- Colori: usa prima i token del tema in `src/tailwind.css` (`primary-*`, `surface-*`, `neutral-*`, `violet-*`). Se il colore non esiste tra i token, usa un colore di default di Tailwind (es. `red-500`, `white`).
- Se un colore di Tailwind è usato in più punti, aggiungilo al tema come token in `@theme` (`--color-<nome>`) e usa quello. Il valore arbitrario (es. `bg-[#1a1a2e]`) solo se nessun colore di Tailwind va bene e serve in un solo punto.
- Spaziature (`p-*`, `m-*`, `gap-*`, `w-*`, `h-*`, ...): usa la scala di Tailwind (es. `p-4`, `gap-2`). Il valore arbitrario (es. `p-[13px]`) solo se la scala non ha un valore adatto e serve in un solo punto; se è usato in più punti, aggiungi un token in `@theme` (`--spacing-*`) e usa quello.
- Stessa regola per le altre scale di Tailwind (font size, shadow, z-index, ...): prima il tema, poi la scala di default di Tailwind; valore arbitrario solo se nessun valore va bene e serve in un solo punto; token in `@theme` se è usato in più punti.
- Nei file CSS usa `var(--color-<nome>)`.
- Raggi dei bordi con le classi `rounded-*` (i valori sono definiti in `@theme` come `--radius-*`).
- Niente classi CSS globali per i componenti: stile con Tailwind dentro il componente. Il CSS globale resta in `public/theme/` (sfondo, glass, token).
- `src/tailwind.css` contiene solo ciò che serve a più punti dell'app (token, raggi, font, breakpoint). `@keyframes` e animazioni usati da un solo componente vanno nel `.css` del componente (`angular.md`, sezione «Componenti»), non nel tema; se un secondo componente li vuole, si spostano nel tema.
- Se lo stesso markup compare, o sta per comparire, in più pagine o feature, non copiarlo: crea un componente shared con la skill `shared-component` e importalo (es. `app-tag`, `appButton`, `app-empty-state`).
- Liste che scorrono in orizzontale: usa sempre `app-horizontal-scroller` (scroll nativo, snap, frecce, accessibilità), non riscrivere la logica nella pagina.
- Icone solo con `ng-icon`. Niente `pi pi-*`.
