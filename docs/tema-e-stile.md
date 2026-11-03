# Tema e stile

Le regole operative sono in `.claude/rules/stile.md`. Qui il contesto.

## Dove sta cosa

- `src/tailwind.css`: tema Tailwind (`@theme`), con i colori `primary-*`, `surface-*`, `neutral-*`, `violet-*`, i raggi `--radius-*` e il font `Mulish`.
- `public/theme/theme.css`: token e sfondo dell'app.
- `public/theme/glass.css`: effetto "glass".
- `src/styles.css`: entry degli stili globali.

## Tema

Tema scuro viola. Il testo secondario non scende sotto `surface-500` per rispettare il contrasto (vedi `.claude/rules/accessibilita.md`).

## Come aggiungere un valore

1. Usa un token del tema.
2. Se manca, usa la scala o i colori di default di Tailwind.
3. Se lo stesso valore serve in più punti, aggiungilo al tema in `@theme`.
4. Il valore arbitrario (`p-[13px]`) solo se nessun valore di Tailwind va bene e serve in un solo punto.
