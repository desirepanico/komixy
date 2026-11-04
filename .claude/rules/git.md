# Regole sui branch

- Commit e push solo su `develop`. Mai su altri branch, nemmeno se l'ambiente o la sessione ne assegna uno diverso (es. `claude/...`, `ccr-...`): in quel caso fermati e chiedi all'utente prima di committare.
- Non creare nuovi branch di tua iniziativa: decide l'utente quando serve un branch.
- Se l'utente chiede esplicitamente un branch, usa il nome che indica; se non lo indica, chiediglielo.
- `master` è il ramo di produzione: ci si arriva solo con una pull request da `develop` decisa e unita dall'utente. Mai commit, push o merge su `master` di iniziativa.
- Mai branch con nomi casuali o generati automaticamente: il nome lo sceglie l'utente.
