#!/bin/bash
# Hook PostToolUse su Edit|Write: se è stato modificato un file di traduzione, controlla it.json/en.json.
file=$(node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{try{console.log(JSON.parse(d).tool_input.file_path||"")}catch{console.log("")}})')
case "$file" in
  */public/i18n/*.json) node "$CLAUDE_PROJECT_DIR/.claude/hooks/check-i18n.mjs" ;;
esac
