#!/bin/bash
# Hook SessionStart: installa le dipendenze se mancano o se package.json/package-lock.json sono cambiati.
cd "$CLAUDE_PROJECT_DIR" || exit 0
node scripts/ensure-deps.mjs >&2 || echo "Installazione delle dipendenze fallita: installale a mano" >&2
exit 0
