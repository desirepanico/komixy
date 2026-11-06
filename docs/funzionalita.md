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
| Login | `/login` | `auth` | Attiva, fuori dal layout: form reattivo (email e password) con errori dopo l'invio; l'accesso è simulato in `AuthService` (TODO API) e torna alla pagina richiesta (`returnUrl`, solo percorsi interni) o a Scopri |
| Non trovata | qualsiasi altra | `not-found` | Attiva: pagina 404 |

## Componenti condivisi

- `app-tag`, `appButton` (su `button` o `a`; varianti `filled`, `outlined`, `text`; severity `primary`, `secondary`, `success`, `info`, `warn`, `danger`, `contrast`, come nei set Severity, Outlined e Text di Figma)
- `appToggleButton` (su `button`, 36px (un po' più grande dei 30px di Figma), solo tondo): bottone a due stati con `pressed`, usato per il segnalibro nelle card. Imposta da solo `aria-pressed`; l'`aria-label` lo passa chi lo usa
- `app-field-wrapper`: nome del campo (`label`, chiave Transloco), controllo come contenuto e messaggio d'errore (`error`, chiave Transloco, con `errorParams`). `inputId` è lo stesso del controllo, così l'etichetta lo seleziona e `aria-describedby` punta al messaggio
- `app-input-text` e `app-input-password` (cartella `shared/components/input/`): controlli per i Signal Forms, si legano con `[formField]`. Mostrano l'errore (`aria-invalid`, `aria-describedby`) solo dopo che il campo è stato toccato; la password ha il bottone occhio con `aria-pressed`. Si usano dentro `app-field-wrapper` (esempio: `login-form`)
- `app-horizontal-scroller`: liste che scorrono in orizzontale (scroll nativo, snap, frecce visibili col mouse e nascoste solo sui dispositivi touch, tasti freccia da tastiera)
- Direttive `appSwipe` (swipe tra pagine) e `appInView`

## Layout

- Desktop: sidebar laterale.
- Mobile: barra di navigazione in basso, swipe tra le pagine principali.

> Aggiorna la tabella quando una pagina cambia stato.
