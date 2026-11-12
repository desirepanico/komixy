---
paths:
  - "src/**/*.ts"
  - "src/**/*.html"
  - "src/**/*.css"
  - "public/theme/**"
---

# Regole sui commenti

Un commento spiega il **perché**, mai il cosa: se leggendo il codice si capisce già cosa fa, non serve. Pochi commenti, nei punti dove chi legge si fermerebbe a chiedersi «perché così?».

## Dove sì

- **JSDoc su componenti e direttive di `shared`**: a cosa servono e come si usano, con un esempio breve. Sugli `input()` solo se il valore non è evidente (unità, valori ammessi, effetto di `true`/`false`).
- **Funzioni in `shared/utils` e logica con una regola di business**: una riga su cosa garantiscono o perché esistono.
- **Commento nel corpo del codice** solo per: un workaround, un vincolo del browser o di una libreria, una scelta di accessibilità (es. perché un link è stirato su tutta la card), un numero che sembra strano (soglie, moltiplicatori), un `catch` vuoto (perché si ignora l'errore).
- **`TODO`** con formato fisso `// TODO(api): cosa manca`, così si ritrovano tutti con una ricerca. Dice cosa sostituire e con cosa (es. `PUT/DELETE /me/bookmarks/:comicId`), non «da sistemare».
- **Template**: solo se la struttura non si capisce (accessibilità, ordine di Tab, perché un elemento è nascosto o duplicato, come reagisce il layout a un breakpoint).
- **CSS globale** (`public/theme/`): una riga di intestazione per file che dice a cosa serve, e un commento sulle regole non ovvie (quando usare quale variante, perché un fallback).
- **File di costanti** (`*.const.ts`): intestazione di sezione `// ─── Nome ───` e un commento solo sul valore che non si capisce dal nome (l'unità sta già nel nome: `_MS`, `_PX`).

## Dove no

- Commenti che ripetono il nome (`// Seleziona un fumetto` su `selectComic()`) o raccontano riga per riga.
- Divisori e banner decorativi (`<!-- Logo -->`, `/* ===== VARIABILI ===== */`, righe di `=`): vale solo l'intestazione di sezione nelle costanti.
- Codice commentato: si cancella, la storia è in git.
- Storia del codice («prima era…», «ripulito dal doppio `@if`», «come prima») e nomi di persone o di richieste.
- **La stessa spiegazione in più file**: si scrive una volta, dove vive la logica (la funzione, il componente, la costante), e gli altri punti non la ripetono. Se serve un rimando, si cita il nome (`packCardRadius`).
- Commenti che restano quando il codice cambia: se cambi il codice, cambia o togli il commento.

## Forma

- Italiano, breve: una frase, al massimo due righe.
- Iniziale maiuscola, niente punto finale nei commenti `//` di una riga. Nei JSDoc di più righe le frasi hanno il loro punto.
- Nei test il nome descrive il comportamento: si commenta solo un'impostazione non ovvia.

## Prima del commit

Rileggi i commenti che hai scritto o toccato: ognuno risponde a «perché?» o si cancella. Il subagent `reviewer` segnala quelli che ripetono il codice, quelli ripetuti in più file e i punti con una logica non ovvia e nessun commento.
