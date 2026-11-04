# Architettura

## Stack

- Angular 22: componenti standalone, signals, `OnPush` (default), zoneless, control flow nativo
- Tailwind CSS v4 (tema in `src/tailwind.css`)
- Transloco per le traduzioni
- Icone con `@ng-icons/material-symbols`
- Test con Vitest (`ng test`)
- Hosting su Vercel (single page app, vedi [sviluppo.md](sviluppo.md))

PrimeNG è stato rimosso e non va reintrodotto.

## Struttura di `src/app`

```
core/       singleton dell'app: models, services, guards, interceptors, layout
features/   una cartella per area: auth, comics, discover, not-found, ranking, releases
shared/     componenti, direttive, modelli, servizi e costanti condivisi tra feature (constants, models, services)
```

Ogni feature può avere `pages/`, `components/`, `models/`, `services/`: si crea solo quello che serve. I test `*.spec.ts` stanno accanto al file testato.

### Regole sulle dipendenze

- `features` → `shared` e `core`; `core` → `shared`; `shared` e `core` non importano mai da `features`, e `shared` non importa da `core`. Eccezione: `core` importa da `features/auth` (modello e servizio), che resta nella feature; la dipendenza è a senso unico e `auth` non importa da `core/layout`.
- Una feature non importa da un'altra. Eccezione: `discover` usa la card di `ranking` (a senso unico). Il servizio `WeeklyRankingService` è in `shared/services`.
- Se due feature condividono qualcosa, va in `shared` (componenti, direttive, modelli, servizi, costanti). `core` contiene solo ciò che serve alla shell dell'app (layout, guard, navigazione, avvio).

## Routing

Le rotte principali sono in `app.routes.ts`, con lazy loading per feature. Le feature con più pagine hanno un file `<nome>.routes.ts` caricato con `loadChildren` (`discover`, `comics`). L'enum `AppRoutes` sta in `shared/constants/app-routes.ts`, così nessuna area dipende da `app.routes.ts`.

- Tutte le pagine stanno dentro il layout (`core/layout`), tranne la pagina 404 (`**`).
- `/` reindirizza a `discover`; `discover/ranking` è una rotta figlia, così la voce di menu resta attiva.
- `comic/:id` è una rotta figlia di `comic`: per ora usa lo stesso componente segnaposto, la pagina di dettaglio non è ancora implementata.
- Il router usa le view transitions e il ripristino dello scroll.

### Navigazione principale

`MAIN_PAGES` in `core/models/main-pages.ts` è l'elenco ordinato delle pagine principali: Scopri, Uscite, Libreria, Profilo. È usato dalla nav mobile, dallo swipe tra pagine e dalla direzione delle transizioni. Le zone che scorrono in orizzontale devono avere `data-no-swipe`.

## Accesso e ruoli

- `AuthService` (`features/auth`) tiene l'utente loggato in un signal.
- `userRoleGuard(ruolo)` (`core/guards`) reindirizza al login chi non è autenticato e a `discover` chi non ha il ruolo richiesto.

## Dati

I dati sono ancora simulati nei servizi (es. `WeeklyRankingService`, con `TODO` per l'API reale). `core/models/environment.model.ts` descrive la configurazione dell'API (`baseUrl`, `publicKey`).
