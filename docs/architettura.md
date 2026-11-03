# Architettura

## Stack

- Angular 21: componenti standalone, signals, `OnPush`, control flow nativo
- Tailwind CSS v4 (tema in `src/tailwind.css`)
- Transloco per le traduzioni
- Icone con `@ng-icons/material-symbols`
- Test con Vitest (`ng test`)
- Hosting su Vercel (single page app, vedi [sviluppo.md](sviluppo.md))

PrimeNG è stato rimosso e non va reintrodotto.

## Struttura di `src/app`

```
core/       singleton dell'app: guard, interceptor, layout, modelli e servizi globali, navigazione
features/   una cartella per area: auth, comics, discover, home, not-found, ranking, releases
shared/     componenti e direttive generici, senza logica di business
```

Ogni feature può avere `pages/`, `components/`, `models/`, `services/`: si crea solo quello che serve. I test `*.spec.ts` stanno accanto al file testato.

### Regole sulle dipendenze

- `features` → `shared` e `core`; `shared` e `core` non importano mai da `features`.
- Una feature non importa da un'altra. Eccezione: `discover` usa card e servizio di `ranking` (a senso unico).
- Se due feature condividono qualcosa, va in `shared` (componenti) o in `core` (modelli e servizi).

## Routing

Le rotte sono in `app.routes.ts`, con lazy loading per feature (`loadComponent`) ed enum `AppRoutes`.

- Tutte le pagine stanno dentro il layout (`core/layout`), tranne la pagina 404 (`**`).
- `/` reindirizza a `discover`; `discover/ranking` è una rotta figlia, così la voce di menu resta attiva.
- `comic/:id` è una rotta figlia di `comic`; la pagina di dettaglio non è ancora implementata.
- Il router usa le view transitions e il ripristino dello scroll.

### Navigazione principale

`MAIN_PAGES` in `core/navigation/main-pages.ts` è l'elenco ordinato delle pagine principali: Scopri, Uscite, Libreria, Profilo. È usato dalla nav mobile, dallo swipe tra pagine e dalla direzione delle transizioni. Le zone che scorrono in orizzontale devono avere `data-no-swipe`.

## Accesso e ruoli

- `AuthService` (`features/auth`) tiene l'utente loggato in un signal.
- `userRoleGuard(ruolo)` (`core/guards`) reindirizza al login chi non è autenticato e a `discover` chi non ha il ruolo richiesto.
- Il guard `authGuard` è presente ma commentato.

## Dati

I dati sono ancora simulati nei servizi (es. `WeeklyRankingService`, con `TODO` per l'API reale). `core/models/environment.ts` descrive la configurazione dell'API (`baseUrl`, `publicKey`).
