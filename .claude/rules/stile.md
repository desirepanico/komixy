# Regole di stile (Tailwind e tema)

- Colori: usa prima i token del tema in `src/tailwind.css` (`primary-*`, `surface-*`, `neutral-*`, `violet-*`). Vietati i colori di default di Tailwind (`white`, `black`, `red-500`, `gray-*`, ...).
- Colore che non esiste tra i token: se serve in un solo punto, usa il valore arbitrario (es. `bg-[#1a1a2e]`); se serve in più punti, aggiungilo prima come token in `@theme` (`--color-<nome>`) e usa quello.
- Spaziature (`p-*`, `m-*`, `gap-*`, `w-*`, `h-*`, ...): usa prima la scala di Tailwind (es. `p-4`, `gap-2`). Se serve un valore fuori scala usato in un solo punto, usa il valore arbitrario (es. `p-[13px]`); se è usato in più punti, aggiungi un token in `@theme` (`--spacing-*`) e usa quello.
- Stessa regola per le altre scale di Tailwind (font size, shadow, z-index, ...): prima la scala; valore arbitrario se è usato in un solo punto; token in `@theme` se è usato in più punti.
- Nei file CSS usa `var(--color-<nome>)`.
- Raggi dei bordi con le classi `rounded-*` (i valori sono definiti in `@theme` come `--radius-*`).
- Niente classi CSS globali per i componenti: stile con Tailwind dentro il componente. Il CSS globale resta in `public/theme/` (sfondo, glass, token).
- Se lo stesso markup compare in più feature, crea un componente shared con la skill `shared-component` (es. `app-tag`, `appButton`).
- Liste che scorrono in orizzontale: usa sempre `app-horizontal-scroller` (scroll nativo, snap, frecce, accessibilità), non riscrivere la logica nella pagina.
- Icone solo con `ng-icon`. Niente `pi pi-*`.
