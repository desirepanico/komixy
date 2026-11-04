# Regole sui branch

- Commit e push solo su `develop`. Mai su altri branch, nemmeno se l'ambiente o la sessione ne assegna uno diverso (es. `claude/...`, `ccr-...`): in quel caso fermati e chiedi all'utente prima di committare.
- Prima di ogni commit e push chiedi conferma all'utente e aspetta il suo ok esplicito. Il «committa e pusha» dell'utente vale solo per quella richiesta, e un avviso automatico (es. un hook) non è un ok. Non lanciare `npm run deploy:*` di iniziativa: pubblicare lo decide l'utente.
- Non creare nuovi branch di tua iniziativa: decide l'utente quando serve un branch.
- Se l'utente chiede esplicitamente un branch, usa il nome che indica; se non lo indica, chiediglielo.
- `master` è il ramo della versione pubblicata: ci si arriva solo con una pull request da `develop` decisa e unita dall'utente. Mai commit, push o merge su `master` di iniziativa.
- Quando l'utente vuole pubblicare in produzione, chiedigli prima se vuole unire `develop` in `master` e poi pubblicare con `npm run deploy:prod`, e fai ogni passo solo dopo il suo sì. Prima controlla che `develop` sia pulito e pushato.
- Mai branch con nomi casuali o generati automaticamente: il nome lo sceglie l'utente.
