#!/bin/bash
# Hook PreToolUse su Bash: applica .claude/rules/git.md e il flusso git di CLAUDE.md.
# Legge da stdin il JSON della chiamata; exit 2 blocca il comando e mostra il messaggio a Claude.
#
# Controlla solo i comandi git veri: toglie il testo tra virgolette, divide il comando in
# parti (; && || | a capo) e guarda se una parte INIZIA con `git`. Una frase citata dentro
# `echo`, un messaggio di commit o una stringa di test non fa scattare il blocco.
azione=$(node -e '
let d = "";
process.stdin.on("data", (c) => (d += c)).on("end", () => {
  let cmd = "";
  try { cmd = JSON.parse(d).tool_input.command || ""; } catch {}
  const senzaTesto = cmd.replace(/"(?:\\.|[^"\\])*"|\x27[^\x27]*\x27/g, "\"\"");
  const parti = senzaTesto.split(/;|&&|\|\||\||\n/).map((p) => p.trim());
  const git = (re) => parti.some((p) => re.test(p));
  const prefisso = "^(?:\\w+=\\S+\\s+)*git\\s+(?:-C\\s+\\S+\\s+)?";
  if (git(new RegExp(prefisso + "(?:checkout\\s+-b|switch\\s+-c|branch\\s+[^-\\s])"))) console.log("branch");
  else if (git(new RegExp(prefisso + "commit(?:\\s|$)"))) console.log("commit");
});
')

# 1. Niente nuovi branch di iniziativa: li decide l'utente
if [ "$azione" = "branch" ]; then
  echo "Bloccato: non creare branch di tua iniziativa (vedi .claude/rules/git.md). Chiedi all'utente nome e conferma." >&2
  exit 2
fi

# 2. Prima di ogni commit: traduzioni, build e test
if [ "$azione" = "commit" ]; then
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
