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
| Login | `/login` | `auth` | Attiva, fuori dal layout, ed è la pagina di partenza (`/` rimanda qui). Da 1024px in su due colonne: a sinistra il pannello di marca `app-login-hero` (logo, titolo e quattro copertine vere (One Piece, V for Vendetta, Chainsaw Man, Watchmen) che fluttuano su bagliori viola, file in `public/img/covers`; ogni copertina è un bottone che la gira come una carta e mostra titolo, autore e tipo, un secondo clic la rigira; non aggiunge nulla alla libreria). La pagina è alta quanto la finestra e non scrolla a nessuna misura: sotto 1024px il pannello diventa una fascia sopra al form, che si comprime con l'altezza: le copertine si ingrandiscono a ventaglio, l'invito «Tocca una copertina» con l'icona che pulsa resta sempre, mentre a poca altezza spariscono titolo e sottotitolo (anche quello del form), a destra il form; sotto 1024px il pannello è una fascia sopra al form, con le stesse animazioni (si fermano con `prefers-reduced-motion`). Il form usa i Signal Forms (email e password), gli errori compaiono quando si esce dal campo o si invia; l'accesso è simulato in `AuthService` (TODO API) e torna alla pagina richiesta (`returnUrl`, solo percorsi interni) o a Scopri |
| Non trovata | qualsiasi altra | `not-found` | Attiva: pagina 404 |

## Componenti condivisi

- `app-tag`, `appButton` (su `button` o `a`; varianti `filled`, `outlined`, `text`; severity `primary`, `secondary`, `success`, `info`, `warn`, `danger`, `contrast`, come nei set Severity, Outlined e Text di Figma)
- `appToggleButton` (su `button`, 36px (un po' più grande dei 30px di Figma), solo tondo): bottone a due stati con `pressed`, usato per il segnalibro nelle card. Imposta da solo `aria-pressed`; l'`aria-label` lo passa chi lo usa
- `app-field-wrapper`: nome del campo (`label`, chiave Transloco), controllo come contenuto e messaggio d'errore (`errors`, scelto dal tipo di errore). `inputId` è l'id del controllo, così l'etichetta lo seleziona e `aria-describedby` punta al messaggio. Lo usano, al loro interno, i controlli qui sotto
- `app-input-text` e `app-input-password` (cartella `shared/components/input/`): campi completi (nome del campo, input ed errore) per i Signal Forms, si legano con `[formField]`. `label` e `placeholder` sono chiavi Transloco. I messaggi d'errore sono gli stessi per tutti i form (`validation.*`, scelti dal `kind` in `VALIDATION_MESSAGES`) e il wrapper ci mette il nome del campo, es. «Il campo Email è obbligatorio». L'errore (testo con icona), `aria-invalid` e `aria-describedby` compaiono solo dopo che il campo è stato toccato. `app-input-password` ha il suo `<input>` e il bottone occhio con `aria-pressed`. Esempio: `login-form`
- `app-horizontal-scroller`: liste che scorrono in orizzontale (scroll nativo, snap, frecce visibili col mouse e nascoste solo sui dispositivi touch, tasti freccia da tastiera)
- Direttive `appSwipe` (swipe tra pagine) e `appInView`

## Layout

- Desktop: sidebar laterale.
- Mobile: barra di navigazione in basso, swipe tra le pagine principali.

> Aggiorna la tabella quando una pagina cambia stato.
