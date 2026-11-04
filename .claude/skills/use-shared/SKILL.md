---
name: use-shared
description: Usa un componente di src/app/shared/components indicandone il nome (es. /use-shared button). Legge il componente, ne ricava selector, input e output e lo inserisce nel punto indicato dall'utente. Usare quando l'utente chiede di usare, inserire o sostituire con un componente shared per nome.
argument-hint: <nome-componente> [dove usarlo]
---

# Usa un componente shared

Argomento: `$ARGUMENTS` (primo termine = nome della cartella in `src/app/shared/components/`, il resto = dove e come usarlo).

Componenti disponibili ora (selector da `@Component`):

!`cd src/app/shared/components && for d in */; do d=${d%/}; echo "- $d: $(grep -m1 -o "selector: '[^']*'" $d/$d.ts | cut -d"'" -f2)"; done`

1. Se il nome manca o è impreciso, non indovinare: proponi i nomi dell'elenco sopra che combaciano con ciò che l'utente vuole ottenere (es. «bottone» → `button`), con una riga su cosa fa ciascuno, e chiedi quale usare. Con `AskUserQuestion` offri al massimo 4 opzioni, le più adatte in cima.
2. Se la cartella non esiste, cerca un nome simile e proponilo; se non c'è nulla di adatto, proponi la skill `shared-component` per crearlo. Non inventare componenti.
3. Leggi `<nome>.ts` e `<nome>.html`: ricava selector, `input()`/`input.required()`, `output()`, `<ng-content />` e varianti ammesse (tipi unione).
4. Nel componente di destinazione:
   - aggiungi la classe in `imports` (alias `@shared/components/<nome>/<nome>`, mai percorso relativo tra aree);
   - usa il selector reale: per i selector ad attributo (es. `button[appButton]`) l'attributo va su un elemento nativo;
   - passa tutti gli input obbligatori; testi tramite Transloco (`.claude/rules/i18n.md`, aggiungi le chiavi in `public/i18n/it.json` e `en.json`);
   - rispetta accessibilità (`aria-*`, `focus-visible`) come in `.claude/rules/`.
5. Se il punto di destinazione contiene già markup equivalente, sostituiscilo invece di aggiungerne altro. Non ricreare lo stile del componente con classi Tailwind a mano.
6. Se il componente non copre il caso (variante mancante), non aggirarlo: dillo all'utente e proponi di estenderlo con la skill `shared-component`.
7. Verifica con `npm run lint`, `npm run knip`, `npm test -- --no-watch` e `npm run build`. Niente commit senza ok esplicito (`.claude/rules/git.md`).
