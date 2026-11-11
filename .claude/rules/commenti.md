---
paths:
  - "src/**/*.ts"
  - "src/**/*.html"
  - "src/**/*.css"
  - "public/theme/**"
---

# Regole sui commenti

- Scrivi un commento solo se il codice da solo non basta: spiega il **perché**, non il **cosa**. Se leggendo il codice si capisce già cosa fa, niente commento.
- Niente commenti che ripetono il nome (`// Seleziona un fumetto` su `selectComic()`), che raccontano ogni riga o che dividono blocchi ovvi (`<!-- Logo -->`, `<!-- Titolo -->`).
- Sì ai commenti che spiegano una scelta non ovvia: workaround, vincoli del browser, accessibilità (es. perché un link è "stirato" su tutta la card), regole di business, valori che sembrano strani.
- Sì a un breve JSDoc sui componenti e sulle direttive di `shared` (come si usano, con un esempio) e sugli `input()` il cui valore non è evidente.
- Un `TODO` dice cosa manca: `// TODO: sostituire con i dati reali dell'API`.
- Mai codice commentato: si cancella, la storia è in git.
- Tutti i commenti sono in italiano, brevi e senza storia del codice ("ripulito dal doppio @if", "come prima").
- Nei test il nome del test descrive il comportamento: commenta solo un'impostazione non ovvia.
