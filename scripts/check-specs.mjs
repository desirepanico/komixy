// Controlla che ogni file .ts di src/ abbia il suo spec accanto (vedi .claude/rules/test.md).
// Esclusi: gli spec stessi, i file *.model.ts (solo tipi) e main.ts.
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );

const senzaSpec = walk('src')
  .filter((f) => f.endsWith('.ts') && !f.endsWith('.spec.ts') && !f.endsWith('.d.ts'))
  .filter((f) => !f.endsWith('.model.ts') && !f.endsWith('/main.ts'))
  .filter((f) => !existsSync(f.replace(/\.ts$/, '.spec.ts')));

if (senzaSpec.length) {
  console.error('File senza spec (crea il *.spec.ts accanto):\n' + senzaSpec.map((f) => `- ${f}`).join('\n'));
  process.exit(1);
}
