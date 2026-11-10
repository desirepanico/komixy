---
paths:
  - "src/**/*.html"
  - "src/index.html"
---

# Regole sugli skeleton

## Quando serve

- Lo skeleton compare **finché una chiamata di lettura (GET) è in attesa** e sparisce quando arriva la risposta, con i dati o con un errore: niente ritardi o soglie di tempo, segue solo lo stato della chiamata.
- Sostituisce un **contenuto che non c'è ancora e che va mostrato**: dati di una lettura (liste, dettagli) e immagini remote. Al suo posto non c'è un vuoto né un salto di layout. Si usa `app-skeleton` (`shared/components/skeleton`): non riscrivere `animate-pulse` e `bg-surface-800` nelle pagine.
- **Non serve per le azioni** (login, aggiunta, modifica, eliminazione): il contenuto c'è già, e sostituirlo farebbe sparire e riapparire il form o la card. Il feedback sta sul punto dove l'utente ha agito: il bottone disabilitato con il testo di attesa (`form().submitting()`, vedi `form.md`) o la card disattivata finché il server risponde, poi il toast con l'esito.
- Non serve sulle pagine con contenuto statico o già in memoria (es. i segnaposto con `app-empty-state`): lo skeleton si aggiunge quando compare un caricamento vero.
- Una nuova lettura sopra dati già mostrati (filtro, ordinamento) è di nuovo una lettura: skeleton solo nella parte che cambia, senza svuotare il resto della pagina.

## Come si scrive

- Ha le stesse misure del contenuto vero (le classi di larghezza, altezza e raggio vanno sul tag `app-skeleton` o sul suo contenitore), così quando il contenuto arriva nulla si sposta.
- Si mostra con `@if` su un signal (`loaded`, `loading`, o `isLoading()` di `resource()` / `httpResource()`) e sparisce quando il contenuto è pronto, anche in caso di errore: non resta mai acceso.
- In caso di errore, al posto dello skeleton compare un messaggio (con `role="alert"`) e un `<button>` per riprovare, non una pagina vuota.
- Niente skeleton generato da un interceptor: non conosce le misure del contenuto e causerebbe salti di layout.

## Accessibilità

- `app-skeleton` è solo decorativo (`aria-hidden`, già nel componente) e si ferma con `prefers-reduced-motion` (`motion-reduce:animate-none`, già nel componente). Dentro uno skeleton non ci sono mai elementi interattivi (link, bottoni, campi): niente tappe del Tab.
- Il caricamento lo annuncia il contenitore, non lo skeleton: l'area che si sta caricando ha `[attr.aria-busy]="loading()"`, a `true` finché i dati non arrivano.
- Per un caricamento di pagina o di lista c'è anche un'area `role="status"` visibile solo agli screen reader (`sr-only`), unica per pagina, con il testo tradotto («Caricamento in corso…» quando parte, «Contenuto caricato» quando finisce). Non una per ogni skeleton: uno screen reader leggerebbe decine di messaggi. Un singolo elemento piccolo (una copertina) non annuncia niente.
- I testi per gli screen reader si traducono come tutti gli altri (`i18n.md`).
- Il focus non si perde: se l'elemento che lo ha viene sostituito dal contenuto vero, il focus resta su un elemento stabile vicino (regola in `accessibilita.md`, sezione «Uso da tastiera»).
- Il contrasto dello skeleton (`bg-surface-800` su sfondo scuro) non è un requisito WCAG, perché non contiene informazioni: l'informazione sta nell'annuncio e nel contenuto che arriva.

## Skeleton di avvio

- Lo skeleton di avvio in `src/index.html` è HTML puro perché Angular non è ancora partito: usa gli stessi token (`bg-surface-800`) e la stessa animazione; sta fuori da `<app-root>` e lo toglie `provideBootSkeleton()` dopo la prima navigazione; la sua guida è nel commento in quel file.
