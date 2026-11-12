---
paths:
  - "src/app/**/*.ts"
  - "src/app/**/*.html"
---

# Stato della pagina nell'indirizzo (query params)

- Ciò che cambia **cosa si vede** nella pagina (vista, filtro, ordinamento, tab, pagina di una lista) sta nell'indirizzo come query param (`/discover/ranking?view=cards`): così il link si condivide e apre la stessa schermata, e il tasto Indietro la ritrova. **Non si salva nello storage del browser** (`localStorage`, `sessionStorage`, cookie, IndexedDB): né la vista né i filtri, nemmeno per ricordare l'ultima scelta. Per ricordarla mentre l'app è aperta si usa un servizio con un `signal` (sezione «Il parametro vince»), che si perde ricaricando: è voluto. Lo storage resta solo per ciò che non è una preferenza di interfaccia e che per ora non ha un backend (`komixy.weeklyPack`, con il suo `TODO`), e in futuro per l'identità dell'ospite (`guest_id`). Ciò che è solo un dettaglio effimero (carta aperta, menu aperto, testo in un campo) resta in un signal.
- **Lettura**: la pagina legge il parametro con `ActivatedRoute.queryParamMap` (`toSignal(..., { requireSync: true })`) e lo trasforma in un `computed`. Un valore mancante o sconosciuto non è un errore: si usa il valore di riserva.
- **Scrittura**: la fa il servizio di navigazione della feature, con un metodo `goToXxx()` (`RankingNavigationService.goToView()`), perché pagine e componenti non usano `Router` (`angular.md`, sezione «Routing»). Per una scelta dell'utente fra viste o filtri usa `replaceUrl: true`: non aggiunge una voce alla cronologia, così Indietro lascia la pagina e non passa per ogni cambio.
- **Il nome del parametro** è una costante in `shared/constants/navigation.const.ts` (`RANKING_VIEW_QUERY_PARAM`), usata da chi legge e da chi scrive. Valori ammessi e tipo stanno in un `*.model.ts` della feature (`RankingView`).
- **Il parametro vince su ciò che si ricorda**: se la pagina ricorda l'ultima scelta in memoria (servizio con un `signal`, come `RankingViewService`), l'ordine è parametro dell'indirizzo → ultima scelta → valore predefinito. Il parametro valido diventa anche l'ultima scelta (una sola volta, nel costruttore, mai con un `effect`). Chi sceglie scrive sempre il valore esplicito, anche quello predefinito, altrimenti «nessun parametro» e «ho scelto il predefinito» si confondono.
- **Non si mettono nell'indirizzo** dati personali, token o identificativi dell'utente: il link si condivide.
- **Test**: la pagina con un parametro nell'indirizzo si prova con `RouterTestingHarness` e la sua rotta in `provideRouter` (una sola `RouterTestingHarness.create()` per test; per uscire e rientrare si naviga a un'altra rotta e si torna). Si controllano il parametro valido, quello sconosciuto, l'assenza, e che la scelta lo scriva nell'indirizzo (`TestBed.inject(Router).url`).
