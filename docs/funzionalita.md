# Funzionalità

Komixy è un'app per collezionisti di fumetti e manga.

| Pagina | Rotta | Feature | Stato |
|---|---|---|---|
| Scopri | `/discover` | `discover` | Attiva: manga da scoprire e Top 5 della settimana |
| Classifica | `/discover/ranking` | `ranking` | Attiva: classifica settimanale completa |
| Uscite | `/releases` | `releases` | Segnaposto: intestazione e messaggio provvisorio (`app-empty-state`) |
| Fumetto | `/comic/:id` | `comics` | Segnaposto: intestazione e messaggio provvisorio (`app-empty-state`); manca la pagina di dettaglio |
| Libreria | `/library` | `library` | Segnaposto: intestazione e messaggio provvisorio (`app-empty-state`) |
| Profilo | `/profile` | `profile` | Segnaposto: intestazione e messaggio provvisorio (`app-empty-state`) |
| Scan | `/scan` | — | Voce nell'enum delle rotte, non ancora implementata |
| Login | `/login` | `auth` | Attiva, fuori dal layout: form reattivo (email e password) con errori dopo l'invio; l'accesso è simulato in `AuthService` (TODO API) e torna alla pagina richiesta (`returnUrl`, solo percorsi interni) o a Scopri |
| Non trovata | qualsiasi altra | `not-found` | Attiva: pagina 404 |

## Componenti condivisi

- `app-tag`, `appButton` (su `button` o `a`; varianti `filled`, `outlined`, `text`)
- `app-horizontal-scroller`: liste che scorrono in orizzontale (scroll nativo, snap, frecce visibili col mouse e nascoste solo sui dispositivi touch, tasti freccia da tastiera)
- Direttive `appSwipe` (swipe tra pagine) e `appInView`

## Layout

- Desktop: sidebar laterale.
- Mobile: barra di navigazione in basso, swipe tra le pagine principali.

> Aggiorna la tabella quando una pagina cambia stato.
