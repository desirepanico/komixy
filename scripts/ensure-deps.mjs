// Installa le dipendenze se package.json o package-lock.json sono cambiati dall'ultima installazione
// (es. dopo un `git pull` che aggiunge un pacchetto). Parte da sola prima di start, build, test, lint e knip.
// L'impronta sta in node_modules: se la cartella manca o l'impronta è diversa, serve `npm install`.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

// In CI le dipendenze arrivano già da `npm ci`.
if (process.env.CI) process.exit(0);

const FILE_IMPRONTA = 'node_modules/.komixy-deps-hash';

const impronta = createHash('sha1')
  .update(readFileSync('package.json'))
  .update(existsSync('package-lock.json') ? readFileSync('package-lock.json') : '')
  .digest('hex');

const salvata = existsSync(FILE_IMPRONTA) ? readFileSync(FILE_IMPRONTA, 'utf8').trim() : '';
if (salvata === impronta && existsSync('node_modules')) process.exit(0);

console.log('Dipendenze cambiate: installo con npm install...');
// shell: true perché su Windows npm è npm.cmd
const esito = spawnSync('npm', ['install', '--no-audit', '--no-fund'], {
  stdio: 'inherit',
  shell: true,
});
if (esito.status !== 0) {
  console.error('npm install non è riuscito: installa le dipendenze a mano.');
  process.exit(esito.status ?? 1);
}

// Dopo l'installazione package-lock.json può essere stato aggiornato: l'impronta si ricalcola.
const finale = createHash('sha1')
  .update(readFileSync('package.json'))
  .update(existsSync('package-lock.json') ? readFileSync('package-lock.json') : '')
  .digest('hex');
writeFileSync(FILE_IMPRONTA, finale);
