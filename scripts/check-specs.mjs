// Controlla le regole sugli spec (vedi .claude/rules/test.md):
// 1. ogni file .ts di src/ ha il suo spec accanto;
// 2. ogni file con spec sta in una cartella propria, insieme al suo spec (e al suo .html se è un componente).
// Esclusi: gli spec, i *.d.ts, i *.model.ts (solo tipi), i *.const.ts (costanti, vedi .claude/rules/costanti.md), main.ts, i file nella radice di src/app (app.ts, app.config.ts, app.routes.ts) e le impostazioni di src/environments (solo valori, uno per ambiente).
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );

const sorgenti = walk('src')
  .filter((f) => f.endsWith('.ts') && !f.endsWith('.spec.ts') && !f.endsWith('.d.ts'))
  .filter((f) => !/\.(model|const)\.ts$/.test(f) && !f.endsWith('/main.ts'))
  .filter((f) => !f.startsWith('src/environments/'));

const senzaSpec = sorgenti.filter((f) => !existsSync(f.replace(/\.ts$/, '.spec.ts')));

const perCartella = new Map();
for (const f of sorgenti.filter((f) => dirname(f) !== 'src/app')) {
  perCartella.set(dirname(f), [...(perCartella.get(dirname(f)) ?? []), f]);
}
const cartelleCondivise = [...perCartella].filter(([, file]) => file.length > 1);

const errori = [];
if (senzaSpec.length) {
  errori.push(
    'File senza spec (crea il *.spec.ts accanto):\n' + senzaSpec.map((f) => `- ${f}`).join('\n'),
  );
}
if (cartelleCondivise.length) {
  errori.push(
    'Più file con spec nella stessa cartella (uno per cartella, con il suo spec):\n' +
      cartelleCondivise
        .map(([dir, file]) => `- ${dir}: ${file.map((f) => f.split('/').pop()).join(', ')}`)
        .join('\n'),
  );
}

if (errori.length) {
  console.error(errori.join('\n\n'));
  process.exit(1);
}
