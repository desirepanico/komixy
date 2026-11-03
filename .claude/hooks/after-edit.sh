#!/bin/bash
# Hook PostToolUse su Edit|Write:
# - traduzioni modificate: controlla it.json/en.json;
# - file .ts/.html in src/: lancia ESLint sul file e, se trova errori, li mostra a Claude.
file=$(node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{try{console.log(JSON.parse(d).tool_input.file_path||"")}catch{console.log("")}})')
case "$file" in
  */public/i18n/*.json)
    node "$CLAUDE_PROJECT_DIR/.claude/hooks/check-i18n.mjs"
    ;;
  */src/*.ts|*/src/*.html)
    [ -f "$file" ] || exit 0
    cd "$CLAUDE_PROJECT_DIR" || exit 0
    out=$(npx --no-install eslint "$file" 2>&1) || { echo "$out" >&2; exit 2; }
    ;;
esac
