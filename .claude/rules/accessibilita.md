---
paths:
  - "src/app/**/*.html"
  - "src/app/**/*.ts"
---

# Regole di accessibilità

- Devono passare tutti i controlli AXE.
- Rispetta il livello WCAG AA, inclusi gestione del focus, contrasto dei colori e attributi ARIA.
- Contrasto minimo del testo: 4,5 a 1 (3 a 1 per il testo grande e per icone e bordi dei componenti). Sul tema scuro il testo secondario usa almeno `surface-500` su `surface-900` o `surface-950`; su sfondi più chiari (`surface-800` e oltre, glass) usa `surface-400` o più chiaro.
- Ogni elemento interattivo ha un `focus-visible` ben visibile (es. `focus-visible:outline-2 focus-visible:outline-primary-400`).
- **Mai `outline-none` insieme a `focus-visible:outline-*` sullo stesso elemento**: in Tailwind v4 `outline-none` imposta lo stile del bordo su `none` e `focus-visible:outline-2` non lo riattiva, quindi l'anello non compare mai. Basta `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400`, senza `outline-none`: col mouse il browser non disegna comunque l'anello. `outline-none` resta solo dove l'anello è disegnato altrove (es. la card, con `has-[a:focus-visible]:` o `focus-visible:after:ring-2`). Si controlla nel browser con Tab, non basta guardare le classi.
- I bottoni con sola icona hanno `aria-label` tradotto con Transloco.
- Gli elementi che navigano sono `<a>` con `routerLink`, quelli che eseguono un'azione sono `<button>`. Mai `<div>` cliccabili senza ruolo e gestione da tastiera.
- Le immagini hanno un `alt` significativo; le decorative `alt=""` o `aria-hidden="true"`.

## Uso da tastiera

Regola generale: tutto ciò che si fa con mouse o touch si deve poter fare anche solo da tastiera (Tab, Maiusc+Tab, Invio, Spazio, frecce, Esc).

- Nessuna funzione solo su hover, swipe, drag o scroll col dito: serve sempre un'alternativa da tastiera (es. lo swipe tra pagine ha la barra di navigazione, la lista orizzontale ha le frecce e i tasti freccia).
- Usa solo elementi nativi interattivi (`<a>`, `<button>`, `<input>`...): si raggiungono con Tab e si attivano con Invio/Spazio senza codice extra. Mai `tabindex` maggiore di 0. Una zona che scorre (es. `app-horizontal-scroller`) non ha `tabindex` se contiene elementi focalizzabili: il focus e l'anello stanno sugli elementi (es. le card), non sul contenitore.
- Card cliccabile: un solo `<a routerLink>` sul titolo con `after:absolute after:inset-0` e il contenitore `relative`; i bottoni dentro la card (es. segnalibro) hanno `relative z-10`. Mai `<div>` con `routerLink` o `(click)`. Il focus della card si mostra con `has-[a:focus-visible]:`.
- L'ordine di Tab segue l'ordine visivo. Gli elementi nascosti non devono essere raggiungibili (`hidden` o `invisible`, non solo `opacity-0`).
- Se un elemento che ha il focus sparisce o si disabilita (es. freccia a fine lista), sposta il focus su un elemento vicino (es. l'altra freccia): il focus non va mai perso.
- Prova ogni nuova pagina o componente usando solo Tab, Invio, Spazio ed Esc.

## Componenti condivisi (`shared/components`)

Un componente shared si usa in tante pagine: se non è accessibile da tastiera, non lo è nessuna.

- Ogni parte interattiva è un elemento nativo (`<button type="button">`, `<a>`, `<input>`): Tab, Maiusc+Tab, Invio e Spazio funzionano senza codice. Niente `<div>` o `<span>` con `(click)`, niente `tabindex` positivo.
- Un gruppo di bottoni a due stati (come `app-select-button`) resta una fila di `<button>` con `aria-pressed` dentro un `role="group"` con nome: ogni voce si raggiunge con Tab. Le frecce non servono.
- Solo un widget composto davvero (`role="tablist"`, `radiogroup`, menu, lista con selezione) segue il pattern ARIA del suo ruolo: un solo elemento raggiungibile con Tab (gli altri `tabindex="-1"`), frecce per spostarsi, Home e Fine per gli estremi, e il focus che segue la voce scelta.
- L'anello di focus segue gli angoli di ciò che circonda. Una carta (`app-pack-card`) è disegnata a grandezza piena e poi rimpicciolita, quindi i suoi angoli si riducono: l'elemento che la avvolge (link o bottone con il focus) non usa `rounded-xl` ma `[style.border-radius]="…"` con `packCardRadius(scala)` (`shared/utils/pack-card-radius`).
- Il `focus-visible` è dentro il componente (non lo aggiunge chi lo usa) e il focus non va perso se l'elemento cambia o sparisce.
- Lo spec controlla la tastiera: gli elementi sono nativi, non hanno `tabindex` che li escluda, si possono portare in focus (`focus()` e `document.activeElement`) e, se c'è una gestione dei tasti, ogni tasto previsto (`dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))`). Tab vero e Invio nativo jsdom non li simula: prova il componente a mano con la sola tastiera.

## Form

- L'errore non si riconosce solo dal colore: il messaggio ha sempre il testo e un'icona (`app-field-wrapper`), e il campo ha `aria-invalid` e `aria-describedby`.
- Dopo un invio fallito il focus va al primo campo con l'errore (`onInvalid` del form, vedi `form.md`).
- Sul campo in errore l'anello di focus resta staccato dal bordo rosso con `outline-offset-2`: a contatto, viola e rosso hanno solo 1,26 a 1 e non si distinguono.
