# Funzionalità

Komixy è un'app per collezionisti di fumetti e manga.

| Pagina | Rotta | Feature | Stato |
|---|---|---|---|
| Scopri | `/discover` | `discover` | Attiva: manga da scoprire e Top 5 della settimana |
| Classifica | `/discover/ranking` | `ranking` | Attiva: classifica settimanale completa |
| Uscite | `/releases` | `releases` | Segnaposto: la pagina mostra solo un testo provvisorio |
| Fumetto | `/comic/:id` | `comics` | Segnaposto (testo provvisorio); manca la pagina di dettaglio |
| Libreria | `/library` | `library` | Segnaposto: la pagina mostra solo un testo provvisorio |
| Profilo | `/profile` | `profile` | Segnaposto: la pagina mostra solo un testo provvisorio |
| Scan | `/scan` | — | Voce nell'enum delle rotte, non ancora implementata |
| Login | `/login` | `auth` | Attiva, fuori dal layout: form reattivo (email e password) con errori dopo l'invio; l'accesso è simulato in `AuthService` (TODO API) e torna alla pagina richiesta (`returnUrl`, solo percorsi interni) o a Scopri |
| Non trovata | qualsiasi altra | `not-found` | Attiva: pagina 404 |

## Componenti condivisi

- `app-tag`, `appButton` (su `button` o `a`), `appBookmarkButton` (su `button`)
- `app-horizontal-scroller`: liste che scorrono in orizzontale (scroll nativo, snap, frecce visibili col mouse e nascoste solo sui dispositivi touch, tasti freccia da tastiera)
- Direttive `appSwipe` (swipe tra pagine) e `appInView`

## Layout

- Desktop: sidebar laterale.
- Mobile: barra di navigazione in basso, swipe tra le pagine principali.

> Aggiorna la tabella quando una pagina cambia stato.
