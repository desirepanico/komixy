#!/bin/bash
# Hook PreToolUse su Bash: applica .claude/rules/git.md e il flusso git di CLAUDE.md.
# Legge da stdin il JSON della chiamata; exit 2 blocca il comando e mostra il messaggio a Claude.
cmd=$(node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{try{console.log(JSON.parse(d).tool_input.command||"")}catch{console.log("")}})')

# 1. Niente nuovi branch di iniziativa: li decide l'utente
if echo "$cmd" | grep -Eq 'git +(checkout +-b|switch +-c|branch +[^-])'; then
  echo "Bloccato: non creare branch di tua iniziativa (vedi .claude/rules/git.md). Chiedi all'utente nome e conferma." >&2
  exit 2
fi

# 2. Prima di ogni commit: traduzioni, build e test
if echo "$cmd" | grep -Eq 'git +commit'; then
  cd "$CLAUDE_PROJECT_DIR" || exit 0
  if ! out=$(node .claude/hooks/check-i18n.mjs 2>&1); then
    echo "Commit bloccato: traduzioni non valide." >&2
    echo "$out" >&2
    exit 2
  fi
  if ! out=$(npm run build 2>&1); then
    echo "Commit bloccato: 'npm run build' è fallita." >&2
    echo "$out" | tail -n 30 >&2
    exit 2
  fi
  if ! out=$(npm test 2>&1); then
    echo "Commit bloccato: 'npm test' è fallito." >&2
    echo "$out" | tail -n 30 >&2
    exit 2
  fi
fi
exit 0
