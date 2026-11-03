# Regole di stile (Tailwind e tema)

- Colori solo dai token del tema in `src/tailwind.css`: `primary-*`, `surface-*`, `neutral-*`, `violet-*`.
- Vietati hex, `rgb()`/`hsl()` e i colori di default di Tailwind (`white`, `black`, `red-500`, `gray-*`, ...).
- Se un colore che serve non esiste tra i token, usa il token esistente più vicino, oppure chiedi all'utente se vuole aggiungerlo al tema. Non aggiungere token in `@theme` di tua iniziativa e non usare colori di default o valori inventati.
- Spaziature (`p-*`, `m-*`, `gap-*`, `space-*`, `w-*`, `h-*`, ...) solo con la scala di Tailwind (multipli di `--spacing`, es. `p-4`, `gap-2`). Vietati i valori arbitrari in pixel (`p-[13px]`, `mt-[7px]`). Se la scala non basta, usa il valore più vicino della scala oppure chiedi all'utente se vuole aggiungere un token in `@theme` (`--spacing-*`), senza usare un valore libero.
- Vale lo stesso per tutte le altre scale di Tailwind (font size, font weight, shadow, breakpoint, z-index, ...): usa le classi della scala (o chiedi all'utente se aggiungere un token in `@theme`), mai valori arbitrari tra parentesi quadre.
- Nei file CSS usa `var(--color-<nome>)`.
- Raggi dei bordi con le classi `rounded-*` (i valori sono definiti in `@theme` come `--radius-*`).
- Niente classi CSS globali per i componenti: stile con Tailwind dentro il componente. Il CSS globale resta in `public/theme/` (sfondo, glass, token).
- Se lo stesso markup compare in più feature, crea un componente shared con la skill `shared-component` (es. `app-tag`, `appButton`).
- Liste che scorrono in orizzontale: usa sempre `app-horizontal-scroller` (scroll nativo, snap, frecce, accessibilità), non riscrivere la logica nella pagina.
- Icone solo con `ng-icon`. Niente `pi pi-*`.
