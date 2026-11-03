#!/bin/bash
# Hook SessionStart: installa le dipendenze solo se mancano (es. sessioni cloud con clone nuovo).
cd "$CLAUDE_PROJECT_DIR" || exit 0
if [ ! -d node_modules ]; then
  npm ci --no-audit --no-fund >&2 || echo "npm ci fallita: installa le dipendenze a mano" >&2
fi
exit 0
