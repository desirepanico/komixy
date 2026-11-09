---
paths:
  - 'src/**/*.ts'
  - 'src/**/*.html'
  - 'src/**/*.css'
  - 'public/theme/**'
---

# Regole sui commenti

- **Pochi commenti, solo dove il codice non si capisce da solo.** Il default è nessun commento: ci si arriva solo se un lettore attento, guardando nomi e tipi, non capirebbe il **perché** di una scelta. Non si commenta per completezza né per «documentare» ogni file, classe, metodo, input o costante.
- Sì solo ai commenti che spiegano una scelta non ovvia: workaround, vincoli del browser, accessibilità (es. perché un link è "stirato" su tutta la card), regole di business, valori che sembrano strani, un'interazione con un altro file che non si vede dal codice.
- No a commenti che:
  - ripetono il nome o il tipo (`// Seleziona un fumetto` su `selectComic()`, `/** Chiave Transloco del segnaposto */` su `placeholder`);
  - dicono cosa fa il codice, raccontano ogni riga o dividono blocchi ovvi (`<!-- Logo -->`, `<!-- DESKTOP -->`, banner `=====` nei CSS);
  - descrivono cos'è un componente, un servizio, un modello o una costante quando lo dice già il nome (`/** Rotte della feature X */`, `/** Ruolo dell'utente */`);
  - ripetono una regola già scritta in `CLAUDE.md`, `.claude/rules/` o `docs/`;
  - raccontano la storia del codice o la sua origine («dal vecchio preset PrimeNG», «ripulito dal doppio @if», «come prima»).
- Un JSDoc (anche sui componenti e sulle direttive di `shared`) c'è solo se l'uso non si ricava dal selector e dagli input, o se serve un esempio per un uso non ovvio: breve, di una o due righe. Niente JSDoc su ogni `input()`: solo su quello il cui valore non è evidente.
- Un `TODO` dice cosa manca: `// TODO: sostituire con i dati reali dell'API`.
- Mai codice commentato: si cancella, la storia è in git.
- Tutti i commenti sono in italiano e brevi (una riga, due al massimo).
- Nei test il nome del test descrive il comportamento: commenta solo un'impostazione non ovvia.
- Quando modifichi un file, togli anche i commenti che la regola non ammette e che trovi lì.
