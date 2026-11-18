// Controlla lo skeleton di avvio di src/index.html (regole in .claude/rules/skeleton.md):
// 1. lo script in fondo alla pagina sceglie la variante giusta per ogni indirizzo dell'app (lo esegue davvero, con un indirizzo e uno storage finti);
// 2. ogni variante scelta ha il suo blocco `group-data-[variant=<nome>]/skel:` nell'HTML, e ogni blocco ha una rotta che lo sceglie;
// 3. ospite e busta della settimana (data-guest, data-pack) seguono lo storage, con la settimana ISO calcolata come in iso-week.ts;
// 4. ogni percorso di primo livello di AppRoutes ha uno skeleton suo, non quello della 404.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync('src/index.html', 'utf-8');
const routesSource = readFileSync('src/app/shared/models/app-routes.model.ts', 'utf-8');
const errors = [];

const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if (!script) {
  console.error('check-skeleton: lo script che sceglie la variante non c’è in src/index.html');
  process.exit(1);
}

/** Esegue lo script come il browser: con un indirizzo, uno storage e un «adesso» scelti da noi */
function run({ path, storage = {}, now = '2026-11-17T10:00:00Z', brokenStorage = false }) {
  const attributes = {};
  const skeleton = {
    setAttribute: (name, value) => (attributes[name] = String(value)),
  };
  const RealDate = Date;
  class FakeDate extends RealDate {
    constructor(...args) {
      if (args.length === 0) super(now);
      else super(...args);
    }
  }
  const sandbox = {
    document: { getElementById: (id) => (id === 'skeleton' ? skeleton : null) },
    location: { pathname: path },
    localStorage: {
      getItem: (key) => {
        if (brokenStorage) throw new Error('storage non disponibile');
        return key in storage ? storage[key] : null;
      },
    },
    Date: FakeDate,
  };
  vm.runInNewContext(script, sandbox);
  return attributes;
}

// ─── 1. Variante per indirizzo ───────────────────────────────────────────────
const VARIANTS = [
  ['/', 'login'],
  ['/login', 'login'],
  ['/login/register', 'authtext'],
  ['/login/forgot-password', 'authtext'],
  ['/discover', 'discover'],
  ['/discover/', 'discover'],
  ['/discover/ranking', 'ranking'],
  ['/discover/pack', 'pack'],
  ['/comic', 'placeholder'],
  ['/comic/w1', 'detail'],
  ['/releases', 'placeholder'],
  ['/library', 'placeholder'],
  ['/profile', 'placeholder'],
  ['/non-esiste', 'notfound'],
  ['/scan', 'notfound'],
];
for (const [path, expected] of VARIANTS) {
  const variant = run({ path })['data-variant'];
  if (variant !== expected) errors.push(`${path}: variante «${variant}», attesa «${expected}»`);
}

// ─── 2. Varianti e blocchi dell'HTML ─────────────────────────────────────────
const blocks = new Set(
  [...html.matchAll(/group-data-\[variant=([a-z-]+)\]\/skel:/g)].map((m) => m[1]),
);
const chosen = new Set(VARIANTS.map(([, variant]) => variant));
for (const variant of chosen) {
  if (!blocks.has(variant))
    errors.push(
      `la variante «${variant}» non ha il suo blocco group-data-[variant=${variant}]/skel: in index.html`,
    );
}
for (const variant of blocks) {
  if (!chosen.has(variant))
    errors.push(`il blocco «${variant}» di index.html non è scelto da nessun indirizzo`);
}
const initial = html.match(/id="skeleton"[^>]*data-variant="([a-z-]+)"/)?.[1];
if (!initial || !blocks.has(initial))
  errors.push(`la variante iniziale di #skeleton («${initial}») non ha un blocco`);

// ─── 3. Ospite e busta della settimana ───────────────────────────────────────
const KEY_SESSION = 'komixy.session';
const KEY_PACK = 'komixy.weeklyPack';
const pack = (week) => JSON.stringify({ week, openedAt: '2026-11-17T08:00:00Z' });
const STATES = [
  ['senza storage', {}, '2026-11-17T10:00:00Z', 'true', 'sealed'],
  ['iscritto', { [KEY_SESSION]: 'true' }, '2026-11-17T10:00:00Z', 'false', 'sealed'],
  ['sessione non «true»', { [KEY_SESSION]: 'false' }, '2026-11-17T10:00:00Z', 'true', 'sealed'],
  [
    'busta aperta questa settimana',
    { [KEY_PACK]: pack('2026-W47') },
    '2026-11-17T10:00:00Z',
    'true',
    'opened',
  ],
  [
    "busta di un'altra settimana",
    { [KEY_PACK]: pack('2026-W46') },
    '2026-11-17T10:00:00Z',
    'true',
    'sealed',
  ],
  [
    'domenica, ancora la settimana 47',
    { [KEY_PACK]: pack('2026-W47') },
    '2026-11-22T21:00:00Z',
    'true',
    'opened',
  ],
  [
    'lunedì, settimana nuova (fuso di Roma)',
    { [KEY_PACK]: pack('2026-W47') },
    '2026-11-22T23:30:00Z',
    'true',
    'sealed',
  ],
  [
    '1 gennaio 2027: ancora la 53 del 2026',
    { [KEY_PACK]: pack('2026-W53') },
    '2027-01-01T10:00:00Z',
    'true',
    'opened',
  ],
  [
    '30 dicembre 2024: già la 1 del 2025',
    { [KEY_PACK]: pack('2025-W1') },
    '2024-12-30T10:00:00Z',
    'true',
    'opened',
  ],
  ['contenuto rovinato', { [KEY_PACK]: '{non json' }, '2026-11-17T10:00:00Z', 'true', 'sealed'],
];
for (const [name, storage, now, guest, packState] of STATES) {
  const result = run({ path: '/discover', storage, now });
  if (result['data-guest'] !== guest)
    errors.push(`${name}: data-guest «${result['data-guest']}», atteso «${guest}»`);
  if (result['data-pack'] !== packState)
    errors.push(`${name}: data-pack «${result['data-pack']}», atteso «${packState}»`);
}
const broken = run({ path: '/discover', brokenStorage: true });
if (broken['data-guest'] !== 'true' || broken['data-pack'] !== 'sealed') {
  errors.push(
    'con lo storage non disponibile lo skeleton deve partire da ospite con la busta sigillata',
  );
}

// ─── 4. Percorsi di primo livello di AppRoutes ───────────────────────────────
// Rotte annidate (sotto login o discover) o senza pagina propria: non hanno uno skeleton di primo livello
const NESTED = new Set(['register', 'forgot-password', 'ranking', 'pack', 'not-found', 'scan']);
for (const [, value] of routesSource.matchAll(/=\s*'([a-z-]+)'/g)) {
  if (NESTED.has(value)) continue;
  const variant = run({ path: `/${value}` })['data-variant'];
  if (variant === 'notfound')
    errors.push(`AppRoutes «${value}»: lo script gli dà lo skeleton della 404, serve una variante`);
}

if (errors.length) {
  console.error(
    'check-skeleton: lo skeleton di src/index.html non è coerente con l’app\n  ' +
      errors.join('\n  '),
  );
  process.exit(1);
}
console.log(
  `check-skeleton: ok (${VARIANTS.length} indirizzi, ${STATES.length + 1} stati, ${blocks.size} varianti)`,
);
