#!/bin/bash
# Hook PostToolUse su Edit|Write:
# - traduzioni modificate: controlla it.json/en.json;
# - package.json modificato: installa le dipendenze (scripts/ensure-deps.mjs);
# - file .ts/.html in src/: lancia ESLint sul file e, se trova errori, li mostra a Claude;
# - file .ts in src/ senza *.spec.ts accanto: ricorda di crearlo (regola in .claude/rules/test.md).
file=$(node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{try{console.log(JSON.parse(d).tool_input.file_path||"")}catch{console.log("")}})')
case "$file" in
  */package.json)
    cd "$CLAUDE_PROJECT_DIR" || exit 0
    node scripts/ensure-deps.mjs >&2 || exit 2
    ;;
  */public/i18n/*.json)
    node "$CLAUDE_PROJECT_DIR/.claude/hooks/check-i18n.mjs"
    ;;
  */src/*.ts|*/src/*.html)
    [ -f "$file" ] || exit 0
    cd "$CLAUDE_PROJECT_DIR" || exit 0
    out=$(npx --no-install eslint "$file" 2>&1) || { echo "$out" >&2; exit 2; }
    case "$file" in
      *.spec.ts|*.d.ts|*.model.ts|*/main.ts|*.html) ;;
      *.ts)
        [ -f "${file%.ts}.spec.ts" ] || { echo "Manca lo spec: crea ${file%.ts}.spec.ts nella stessa cartella, una cartella per file (vedi .claude/rules/test.md e angular.md)" >&2; exit 2; }
        ;;
    esac
    ;;
esac
