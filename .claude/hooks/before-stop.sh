#!/bin/bash
# Hook Stop: prima che Claude finisca il turno lancia lint, knip, build e test.
# Se uno fallisce esce con codice 2: Claude vede l'errore e continua a correggere.
# Salta i controlli se non ci sono modifiche a codice, test, traduzioni o configurazione.
cd "$CLAUDE_PROJECT_DIR" || exit 0

changed=$(git status --porcelain 2>/dev/null | grep -E ' (src/|public/i18n/|scripts/|package(-lock)?\.json|angular\.json|knip\.json|eslint\.config|tsconfig)' || true)
[ -z "$changed" ] && exit 0

run() {
  local name="$1"; shift
  local out
  out=$("$@" 2>&1) || {
    echo "Controllo fallito prima della consegna: $name" >&2
    echo "$out" | tail -n 40 >&2
    exit 2
  }
}

run "npm run lint" npm run lint
run "npm run knip" npm run knip
run "npm run build" npm run build
run "npm test" npm test -- --no-watch
exit 0
