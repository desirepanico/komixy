---
name: shared-component
description: Crea o modifica un componente riutilizzabile in src/app/shared/components (es. tag, bottoni, avatar). Usare quando lo stesso markup compare in più feature o quando si sostituisce un componente ex PrimeNG.
---

# Componente shared

1. Crea `src/app/shared/components/<nome>/<nome>.ts` (classe in PascalCase senza suffisso, selector `app-<nome>`).
2. Segui le regole in `.claude/rules/` (angular, stile, accessibilità): standalone (senza `standalone: true`), `input()`/`output()`, `computed()`, control flow nativo (`@if`, `@for`).
2b. Per elementi che devono restare nativi (bottoni, link) usa un selector ad attributo, es. `button[appButton], a[appButton]`, così restano validi `click`, `disabled` e `routerLink`.
3. Crea `<nome>.spec.ts` accanto (regola in `.claude/rules/test.md`): almeno un test che crea il componente e controlla cosa mostra e gli attributi ARIA.
4. Template in un file `./<nome>.html` relativo al file `.ts` (niente template inline nei componenti shared). Contenuto testuale tramite `<ng-content />`; nessun testo hardcoded (Transloco).
5. Stile solo con classi Tailwind e token del tema (`primary-*`, `surface-*`, `rounded-*`): niente CSS globale, niente hex né colori di default Tailwind (`white`, `black`, ...).
6. Varianti con un `input()` tipizzato (es. `severity = input<'primary' | 'secondary'>('primary')`) e classi condizionali `[class.xxx]`.
7. Accessibilità: contrasto WCAG AA, `focus-visible` visibile, `aria-*` sugli elementi interattivi.
8. Sostituisci tutti gli usi duplicati nelle feature importando il componente in `imports`.
9. Verifica con `npm run lint`, `npm test` e `npm run build` prima del commit.
