# Regole di stile (Tailwind e tema)

- Colori solo dai token del tema in `src/tailwind.css`: `primary-*`, `surface-*`, `neutral-*`, `violet-*`.
- Vietati hex e colori di default di Tailwind (`white`, `black`, `red-500`, `gray-*`, ...). Se serve una tinta nuova, aggiungila prima come token in `@theme`.
- Nei file CSS usa `var(--color-<nome>)`.
- Raggi dei bordi con le classi `rounded-*` (i valori sono definiti in `@theme` come `--radius-*`).
- Niente classi CSS globali per i componenti: stile con Tailwind dentro il componente. Il CSS globale resta in `public/theme/` (sfondo, glass, token).
- Se lo stesso markup compare in più feature, crea un componente shared con la skill `shared-component` (es. `app-tag`, `appButton`).
- Icone solo con `ng-icon`. Niente `pi pi-*`.
