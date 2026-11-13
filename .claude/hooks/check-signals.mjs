// Controlla un file .ts di src/app contro le regole sui signal (.claude/rules/signals.md, angular.md).
// Uso: node check-signals.mjs <file>...   (con --all controlla tutto src/app). Esce con 2 se trova violazioni.
// ESLint copre già proprietà non readonly, subscribe() e pipe async: qui solo ciò che ESLint non vede.
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );

const args = process.argv.slice(2);
const files = args.includes('--all') ? walk(join(root, 'src/app')) : args;

const OLD_DECORATORS = new Map([
  ['Input', 'input()'],
  ['Output', 'output()'],
  ['ViewChild', 'viewChild()'],
  ['ViewChildren', 'viewChildren()'],
  ['ContentChild', 'contentChild()'],
  ['ContentChildren', 'contentChildren()'],
]);
const TYPED_CALLS = new Set(['signal', 'input', 'model', 'output']);
const SIGNAL_FACTORIES = new Set(['signal', 'linkedSignal']);
const WRITES = new Set(['set', 'update', 'mutate']);

const problems = [];

for (const file of files) {
  if (!file.endsWith('.ts') || file.endsWith('.spec.ts') || file.endsWith('.d.ts')) continue;
  const text = readFileSync(file, 'utf8');
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const rel = relative(root, file);
  const report = (node, message) => {
    const { line } = source.getLineAndCharacterOfPosition(node.getStart());
    problems.push(`${rel}:${line + 1}: ${message}`);
  };

  const isThisMember = (n) =>
    ts.isPropertyAccessExpression(n) && n.expression.kind === ts.SyntaxKind.ThisKeyword;
  const calleeName = (call) => {
    let c = call.expression;
    if (ts.isPropertyAccessExpression(c)) c = c.expression;
    return ts.isIdentifier(c) ? c.text : null;
  };

  const visit = (node, ctx) => {
    // Decorator al posto delle funzioni a signal
    if (ts.isDecorator(node) && ts.isCallExpression(node.expression)) {
      const name = node.expression.expression.getText();
      if (OLD_DECORATORS.has(name)) report(node, `@${name}: usa ${OLD_DECORATORS.get(name)}.`);
    }

    // signal()/input()/model()/output() con il tipo scritto
    if (ts.isCallExpression(node)) {
      const name = calleeName(node);
      const isFactory = name && TYPED_CALLS.has(name) && ts.isPropertyDeclaration(node.parent);
      if (
        isFactory &&
        !node.typeArguments?.length &&
        !ts.isPropertyAccessExpression(node.expression)
      ) {
        report(node, `${name}() senza tipo: scrivilo (es. ${name}<number>(0)) (angular.md).`);
      }
      // mutate() è stato rimosso: si crea un nuovo valore con set/update
      if (
        ts.isPropertyAccessExpression(node.expression) &&
        node.expression.name.text === 'mutate'
      ) {
        report(
          node,
          'mutate() non si usa: aggiorna con set()/update() restituendo un nuovo valore.',
        );
      }
      // effect() che scrive altri signal: si usa computed/linkedSignal
      if (name === 'effect' && !ts.isPropertyAccessExpression(node.expression)) {
        const callback = node.arguments[0];
        const scan = (n) => {
          if (
            ts.isCallExpression(n) &&
            ts.isPropertyAccessExpression(n.expression) &&
            WRITES.has(n.expression.name.text) &&
            isThisMember(n.expression.expression)
          ) {
            report(
              n,
              `effect() scrive il signal ${n.expression.expression.getText()}: per derivare stato usa computed() o linkedSignal().`,
            );
          }
          ts.forEachChild(n, scan);
        };
        if (callback) scan(callback);
      }
    }

    // this.x = …, this.x++ fuori dal costruttore e dagli inizializzatori
    const assigned =
      ts.isBinaryExpression(node) &&
      node.operatorToken.kind >= ts.SyntaxKind.FirstAssignment &&
      node.operatorToken.kind <= ts.SyntaxKind.LastAssignment
        ? node.left
        : (ts.isPrefixUnaryExpression(node) || ts.isPostfixUnaryExpression(node)) &&
            [ts.SyntaxKind.PlusPlusToken, ts.SyntaxKind.MinusMinusToken].includes(node.operator)
          ? node.operand
          : null;
    if (assigned && isThisMember(assigned) && !ctx.inConstructor) {
      report(
        node,
        `${assigned.getText()} viene riassegnato: lo stato è un signal (.set()/.update()).`,
      );
    }

    // getter che legge un signal: è un computed()
    if (ts.isGetAccessor(node) && node.body) {
      let readsSignal = false;
      const scan = (n) => {
        if (ts.isCallExpression(n) && isThisMember(n.expression)) readsSignal = true;
        ts.forEachChild(n, scan);
      };
      scan(node.body);
      if (readsSignal)
        report(node, `get ${node.name.getText()}() legge un signal: usa computed().`);
    }

    // un servizio espone i signal in sola lettura
    if (ts.isClassDeclaration(node)) {
      const isService = ts
        .getDecorators(node)
        ?.some((d) => d.expression.getText().startsWith('Injectable'));
      if (isService) {
        for (const m of node.members) {
          if (!ts.isPropertyDeclaration(m) || !m.initializer || !ts.isCallExpression(m.initializer))
            continue;
          const mods = ts.getModifiers(m)?.map((x) => x.kind) ?? [];
          const hidden =
            mods.includes(ts.SyntaxKind.PrivateKeyword) ||
            mods.includes(ts.SyntaxKind.ProtectedKeyword);
          if (!hidden && SIGNAL_FACTORIES.has(calleeName(m.initializer))) {
            report(
              m,
              `${m.name.getText()}: un servizio espone il signal con asReadonly() e tiene l'originale private (_${m.name.getText()}).`,
            );
          }
        }
      }
    }

    const inConstructor =
      ctx.inConstructor || ts.isConstructorDeclaration(node) || ts.isPropertyDeclaration(node);
    ts.forEachChild(node, (c) => visit(c, { inConstructor }));
  };
  visit(source, { inConstructor: false });
}

// Template: pipe async e proprietà copiate sono già coperte da ESLint; qui `*ngIf`-style e ngModel
for (const file of files) {
  if (!file.endsWith('.html')) continue;
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (/\|\s*async\b/.test(line))
      problems.push(`${relative(root, file)}:${i + 1}: pipe async: usa toSignal() nel componente.`);
  });
}

if (problems.length) {
  console.error(
    'Regole sui signal non rispettate (.claude/rules/signals.md):\n' +
      problems.map((p) => `- ${p}`).join('\n'),
  );
  process.exit(2);
}
