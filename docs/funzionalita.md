# Funzionalità

Komixy è un'app per collezionisti di fumetti e manga.

| Pagina | Rotta | Feature | Stato |
|---|---|---|---|
| Scopri | `/discover` | `discover` | Attiva: manga da scoprire e Top 5 della settimana; le copertine mostrano `app-skeleton` finché non arrivano |
| Classifica | `/discover/ranking` | `ranking` | Attiva: classifica settimanale completa; le copertine mostrano `app-skeleton` finché non arrivano |
| Uscite | `/releases` | `releases` | Segnaposto: intestazione e messaggio provvisorio (`app-empty-state`) |
| Fumetto | `/comic/:id` | `comics` | Segnaposto: intestazione e messaggio provvisorio (`app-empty-state`); manca la pagina di dettaglio |
| Libreria | `/library` | `library` | Segnaposto: intestazione e messaggio provvisorio (`app-empty-state`) |
| Profilo | `/profile` | `profile` | Segnaposto: intestazione e messaggio provvisorio (`app-empty-state`) |
| Scan | `/scan` | — | Voce nell'enum delle rotte, non ancora implementata |
| Login | `/login` | `auth` | Attiva, fuori dal layout, ed è la pagina di partenza (`/` rimanda qui). La pagina è alta quanto la finestra e non scrolla a nessuna misura. Da 1024px in su due colonne senza linea di separazione (lo sfondo viola è continuo): a sinistra il pannello di marca `app-login-volumes` (marchio `app-brand`, titolo, sottotitolo, invito e copertine), a destra il form in una card con titolo «Accedi» (a sinistra) e sottotitolo. Sotto 1024px niente card né colonne: una sola colonna centrata con marchio, titolo «La tua collezione di fumetti e manga, sempre con te» (più piccolo sui telefoni), invito «Tocca una copertina per scoprirla» (con l'icona che pulsa), copertine a ventaglio, poi i campi del form; il titolo «Accedi» (`h1`) c'è ma sotto 1024px è visibile solo agli screen reader (`sr-only`), perché il bottone dice già «Accedi». L'ordine visivo è quello del DOM, quindi lettura e tab seguono ciò che si vede; il sottotitolo compare solo da 1024px. Le quattro copertine vere (One Piece, V for Vendetta, Chainsaw Man, Watchmen, file in `public/img/covers`) fluttuano su bagliori viola (ciclo di 3 secondi, a coppie sfasate di mezzo ciclo: quando una sale l'altra scende); ognuna è un bottone che la gira come una carta e mostra titolo, autore e tipo; la copertina scelta passa in primo piano sulle altre. Con mouse e tastiera il clic la gira subito; con il dito il primo tocco la porta in avanti e il secondo la gira (l'invito cambia: «Tocca un volume, poi ancora per girarlo»), un terzo la rigira (non aggiunge nulla alla libreria). Un bottone sotto le copertine («Ferma animazione» / «Riprendi animazione») mette in pausa copertine, bagliori e icona che pulsa (WCAG 2.2.2). Con `prefers-reduced-motion` bagliori e icona restano fermi e le copertine fanno solo uno spostamento di 4px, senza rotazione, in loop, senza mai finire da sole (si fermano solo con il bottone, restando inclinate). Il form usa i Signal Forms (email e password), gli errori compaiono quando si esce dal campo o si invia; l'accesso è simulato in `AuthService` (TODO API) e torna alla pagina richiesta (`returnUrl`, solo percorsi interni) o a Scopri |
| Non trovata | qualsiasi altra | `not-found` | Attiva: pagina 404 |

## Componenti condivisi

- `app-brand`: marchio, cioè il logo con la scritta (`public/img/logo/komixy-logo-wordmark.png`, per sfondi scuri). Il nome non si traduce: l'`alt` è «Komixy». Si usa nella sidebar desktop e nel pannello della login. Il favicon (`public/favicon.ico`) è la sola K su un quadrato viola, senza anello né stella: a 16px quelli non si leggono
- `app-tag`, `appButton` (su `button` o `a`; varianti `filled`, `outlined`, `text`; severity `primary`, `secondary`, `success`, `info`, `warn`, `danger`, `contrast`, come nei set Severity, Outlined e Text di Figma)
- `appToggleButton` (su `button`, 36px (un po' più grande dei 30px di Figma), solo tondo): bottone a due stati con `pressed`, usato per il segnalibro nelle card. Imposta da solo `aria-pressed`; l'`aria-label` lo passa chi lo usa
- `app-field-wrapper`: nome del campo (`label`, chiave Transloco), controllo come contenuto e messaggio d'errore (`errors`, scelto dal tipo di errore). `inputId` è l'id del controllo, così l'etichetta lo seleziona e `aria-describedby` punta al messaggio. Lo usano, al loro interno, i controlli qui sotto
- `app-input-text` e `app-input-password` (cartella `shared/components/input/`): campi completi (nome del campo, input ed errore) per i Signal Forms, si legano con `[formField]`. `label` e `placeholder` sono chiavi Transloco. I messaggi d'errore sono gli stessi per tutti i form (`validation.*`, scelti dal `kind` in `VALIDATION_MESSAGES`) e il wrapper ci mette il nome del campo, es. «Il campo Email è obbligatorio». L'errore (testo con icona), `aria-invalid` e `aria-describedby` compaiono solo dopo che il campo è stato toccato. `app-input-password` ha il suo `<input>` e il bottone occhio con `aria-pressed`. Esempio: `login-form`
- `app-horizontal-scroller`: liste che scorrono in orizzontale (scroll nativo, snap, frecce visibili col mouse e nascoste solo sui dispositivi touch, tasti freccia da tastiera)
- Direttive `appSwipe` (swipe tra pagine) e `appInView`

## Layout

- Desktop: sidebar laterale, con il marchio `app-brand` in alto.
- Mobile: barra di navigazione in basso, swipe tra le pagine principali.

> Aggiorna la tabella quando una pagina cambia stato.
