// Controlla che it.json e en.json abbiano le stesse chiavi e nessun valore vuoto (vedi .claude/rules/i18n.md).
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = join(process.env.CLAUDE_PROJECT_DIR ?? process.cwd(), 'public/i18n');

const flatten = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([k, v]) =>
    v !== null && typeof v === 'object' ? flatten(v, `${prefix}${k}.`) : [[`${prefix}${k}`, v]],
  );

const langs = Object.fromEntries(
  readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => [f, new Map(flatten(JSON.parse(readFileSync(join(dir, f), 'utf8'))))]),
);

const errors = [];
const all = new Set(Object.values(langs).flatMap((m) => [...m.keys()]));
for (const [file, map] of Object.entries(langs)) {
  for (const key of all) if (!map.has(key)) errors.push(`${file}: manca la chiave "${key}"`);
  for (const [key, value] of map) if (String(value).trim() === '') errors.push(`${file}: valore vuoto in "${key}"`);
}

if (errors.length) {
  console.error('Traduzioni non valide:\n' + errors.map((e) => `- ${e}`).join('\n'));
  process.exit(2);
}
