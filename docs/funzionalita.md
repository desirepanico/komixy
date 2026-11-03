# Funzionalità

Komixy è un'app per collezionisti di fumetti e manga.

| Pagina | Rotta | Feature | Stato |
|---|---|---|---|
| Scopri | `/discover` | `discover` | Attiva: manga da scoprire e Top 5 della settimana |
| Classifica | `/discover/ranking` | `ranking` | Attiva: classifica settimanale completa |
| Uscite | `/releases` | `releases` | Pagina presente |
| Fumetto | `/comic/:id` | `comics` | Da completare: manca la pagina di dettaglio |
| Libreria | `/library` | — | Voce di menu, rotta non ancora implementata |
| Profilo | `/profile` | — | Voce di menu, rotta non ancora implementata |
| Scan | `/scan` | — | Voce nell'enum delle rotte, non ancora implementata |
| Login | `/login` | `auth` | Rotta nell'enum, pagina non ancora implementata |
| Non trovata | qualsiasi altra | `not-found` | Attiva: pagina 404 |

## Componenti condivisi

- `app-tag`, `appButton`, `app-bookmark-button`
- `app-horizontal-scroller`: liste che scorrono in orizzontale (scroll nativo, snap, frecce)
- Direttive `appSwipe` (swipe tra pagine) e `in-view`

## Layout

- Desktop: sidebar laterale.
- Mobile: barra di navigazione in basso, swipe tra le pagine principali.

> Aggiorna la tabella quando una pagina cambia stato.
