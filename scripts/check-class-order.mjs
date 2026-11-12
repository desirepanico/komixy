// Controlla l'ordine dei membri nelle classi di src/app (regola in .claude/rules/angular.md, sezione «Ordine dei membri»):
// inject → altre proprietà → query (viewChild…) → input/model/output → signal/computed/… → constructor → metodi.
// Le altre proprietà (valori semplici, costanti per il template) stanno prima dei signal perché i signal le leggono quando la classe viene creata.
// Senza argomenti elenca le classi fuori ordine ed esce con errore; con `--fix` le riordina (poi lanciare Prettier).
// Esclusi gli spec: le classi `Host` di prova non seguono la regola.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';

const GROUPS = ['inject', 'other property', 'query', 'input', 'signal', 'constructor', 'method'];

const CALL_GROUP = new Map([
  ['inject', 0],
  ...['viewChild', 'viewChildren', 'contentChild', 'contentChildren'].map((n) => [n, 2]),
  ...['input', 'model', 'output', 'outputFromObservable'].map((n) => [n, 3]),
  ...['signal', 'computed', 'linkedSignal', 'toSignal', 'resource', 'httpResource', 'form'].map((n) => [n, 4]),
]);

/** Nome della funzione chiamata all'inizio dell'inizializzatore (`input.required<T>()` → `input`) */
function calleeName(node) {
  if (!node || !ts.isCallExpression(node)) return null;
  let callee = node.expression;
  if (ts.isPropertyAccessExpression(callee)) callee = callee.expression;
  return ts.isIdentifier(callee) ? callee.text : null;
}

/** `x.asReadonly()` e un riferimento a un altro membro (`this.service.view`) sono signal anche loro */
function isSignalAlias(node) {
  if (!node) return false;
  if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
    return node.expression.name.text === 'asReadonly';
  }
  return ts.isPropertyAccessExpression(node) && node.getText().startsWith('this.');
}

function groupOf(member) {
  if (ts.isConstructorDeclaration(member)) return 5;
  if (ts.isPropertyDeclaration(member)) {
    const group = CALL_GROUP.get(calleeName(member.initializer));
    if (group !== undefined) return group;
    return isSignalAlias(member.initializer) ? 4 : 1;
  }
  return 6;
}

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );

const fix = process.argv.includes('--fix');
const files = walk('src/app').filter((f) => f.endsWith('.ts') && !f.endsWith('.spec.ts'));
const problems = [];

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const edits = [];

  const visit = (node) => {
    if (ts.isClassDeclaration(node)) {
      const members = [...node.members];
      const groups = members.map(groupOf);
      const inOrder = groups.every((g, i) => i === 0 || g >= groups[i - 1]);
      if (!inOrder) {
        const { line } = source.getLineAndCharacterOfPosition(node.getStart());
        const first = members.find((m, i) => i > 0 && groups[i] < groups[i - 1]);
        const at = source.getLineAndCharacterOfPosition(first.getStart()).line + 1;
        problems.push(`${file}:${line + 1} classe ${node.name?.text ?? '(anonima)'}: ${GROUPS[groupOf(first)]} alla riga ${at} dopo un membro che deve venire dopo`);
        if (fix) {
          const order = members
            .map((m, i) => ({ m, g: groups[i], i }))
            .sort((a, b) => a.g - b.g || a.i - b.i);
          let out = '';
          order.forEach(({ m, g }, n) => {
            const chunk = text.slice(m.getFullStart(), m.getEnd()).trimStart();
            const separator = n > 0 && g !== order[n - 1].g ? '\n\n' : '\n';
            out += `${separator}  ${chunk}`;
          });
          edits.push({ start: members[0].getFullStart(), end: members.at(-1).getEnd(), text: out });
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);

  if (fix && edits.length) {
    let result = text;
    for (const e of edits.sort((a, b) => b.start - a.start)) {
      result = result.slice(0, e.start) + e.text + result.slice(e.end);
    }
    writeFileSync(file, result);
  }
}

if (problems.length && !fix) {
  console.error(
    'Membri di classe fuori ordine (inject, altre proprietà, query, input/output, signal, constructor, metodi):\n' +
      problems.map((p) => `- ${p}`).join('\n') +
      '\nRiordinali a mano oppure lancia `node scripts/check-class-order.mjs --fix` e poi Prettier.',
  );
  process.exit(1);
}
if (fix) console.log(`Riordinate ${problems.length} classi`);
