// @ts-check
// @ts-ignore
const eslint = require('@eslint/js');
// @ts-ignore
const tseslint = require('typescript-eslint');
// @ts-ignore
const angular = require('angular-eslint');
// I tipi del plugin non dichiarano `configs`, che a runtime esiste: lo trattiamo come `any`
/** @type {any} */
const betterTailwindcss = require('eslint-plugin-better-tailwindcss');

// defineConfig sostituisce tseslint.config (deprecato)
const { defineConfig } = require('eslint/config');

// ─── Import vietati ──────────────────────────────────────────────────────────
// La regola `no-restricted-imports` blocca gli import che non vogliamo. Ha due modi di indicarli:
// - `paths`: un modulo preciso (e, se serve, solo alcuni suoi nomi);
// - `patterns`: tutti i moduli il cui percorso corrisponde a un'espressione.
// Attenzione: se due blocchi della configurazione la impostano, vince l'ultimo e i due elenchi NON si
// sommano. Per questo i blocchi più specifici (le feature) ripetono gli elenchi di quelli generali.

// Vietati in tutta l'app (regole di .claude/rules/angular.md e form.md)
const RESTRICTED_IMPORT_PATHS = [
  {
    name: '@angular/forms',
    message: 'Usa i Signal Forms (@angular/forms/signals): niente Reactive Forms né ngModel.',
  },
  {
    name: '@angular/common',
    importNames: ['CommonModule', 'NgClass', 'NgStyle'],
    message:
      'Importa solo le direttive e le pipe usate; per classi e stili usa i binding [class.x] e [style.x].',
  },
];

// Vietati solo in pagine e componenti delle feature: si naviga con i servizi di navigazione
const NAVIGATION_IMPORT_PATHS = [
  {
    name: '@angular/router',
    importNames: ['Router'],
    message: 'Naviga con il servizio di navigazione, non con Router.',
  },
  {
    name: '@shared/models/app-routes.model',
    importNames: ['AppRoutes'],
    message: 'I percorsi si costruiscono nei servizi di navigazione.',
  },
];

/**
 * Regole sugli import delle feature (vedi .claude/rules/angular.md):
 * - una feature non importa da un'altra, tranne i servizi di navigazione (`<nome>-navigation`);
 * - pagine e componenti non usano `Router` né `AppRoutes`.
 * Restituisce due blocchi di configurazione: uno per tutti i file della feature, uno più severo per
 * `pages/` e `components/`. Gli spec sono esclusi.
 * @param {string} folder glob delle cartelle delle feature, es. `src/app/features/**`
 * @param {string[]} forbiddenRegexes import vietati tra feature, come espressioni regolari sul percorso
 * @returns {import('eslint').Linter.Config[]}
 */
function featureRules(folder, forbiddenRegexes) {
  const patterns = forbiddenRegexes.map((regex) => ({
    regex,
    message: "Una feature importa da un'altra solo i servizi di navigazione (<nome>-navigation).",
  }));

  return [
    {
      files: [`${folder}/*.ts`],
      ignores: ['**/*.spec.ts'],
      rules: {
        'no-restricted-imports': ['error', { paths: RESTRICTED_IMPORT_PATHS, patterns }],
      },
    },
    {
      files: [`${folder}/pages/**/*.ts`, `${folder}/components/**/*.ts`],
      ignores: ['**/*.spec.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          { paths: [...RESTRICTED_IMPORT_PATHS, ...NAVIGATION_IMPORT_PATHS], patterns },
        ],
      },
    },
  ];
}

module.exports = defineConfig(
  { ignores: ['dist/**', '.angular/**', 'node_modules/**'] },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      // I componenti shared usano selector ad attributo (button[appButton]): la regola non li copre
      '@angular-eslint/component-selector': 'off',
      // Regole di .claude/rules/angular.md
      '@angular-eslint/prefer-standalone': 'error',
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@angular-eslint/prefer-inject': 'error',
      '@angular-eslint/prefer-output-readonly': 'error',
      '@angular-eslint/prefer-output-emitter-ref': 'error',
      '@angular-eslint/prefer-signals': 'error',
      '@angular-eslint/prefer-host-metadata-property': 'error',
      '@angular-eslint/no-host-metadata-property': 'off',
      '@angular-eslint/no-input-rename': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'no-restricted-imports': ['error', { paths: RESTRICTED_IMPORT_PATHS }],
      // Regola di .claude/rules/angular.md, sezione «Nomi»: i membri `private` iniziano con «_»
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'memberLike',
          modifiers: ['private'],
          format: null,
          leadingUnderscore: 'require',
        },
      ],
    },
  },
  ...featureRules('src/app/features/**', ['^@features/(?!.*/services/[^/]+-navigation/)']),
  // Regole di .claude/rules/signals.md: lo stato è sempre in un signal e gli observable diventano signal
  {
    files: ['src/app/**/*.ts'],
    ignores: ['**/*.spec.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'PropertyDefinition[readonly!=true][static!=true]',
          message:
            'Lo stato è un signal (signal<T>()), mai una proprietà modificabile: aggiungi readonly e usa un signal.',
        },
        {
          selector: "CallExpression[callee.property.name='subscribe']",
          message:
            'Niente subscribe(): usa toSignal() per mostrare un observable e firstValueFrom() per una richiesta.',
        },
      ],
    },
  },
  // I provider di avvio reagiscono agli eventi del router con un effetto sul DOM, non su uno stato
  {
    files: ['src/app/core/providers/**/*.ts'],
    ignores: ['**/*.spec.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'PropertyDefinition[readonly!=true][static!=true]',
          message: 'Lo stato è un signal (signal<T>()), mai una proprietà modificabile.',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      betterTailwindcss.configs['recommended-warn'],
    ],
    // Con Tailwind v4 il tema sta in questo file CSS: senza, il plugin non conosce primary-*, surface-*, xs:
    settings: { 'better-tailwindcss': { entryPoint: 'src/tailwind.css' } },
    rules: {
      // L'ordine e l'a capo delle classi li gestisce Prettier (prettier-plugin-tailwindcss)
      'better-tailwindcss/enforce-consistent-class-order': 'off',
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
      // Classi che il plugin non trova nel tema: `glass-*` sono in public/theme/glass.css e `dark` è la
      // variante dichiarata con @custom-variant in tailwind.css
      'better-tailwindcss/no-unknown-classes': ['warn', { ignore: ['^glass-', '^dark$'] }],
      '@angular-eslint/template/prefer-control-flow': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: "BindingPipe[name='async']",
          message: 'Niente pipe async: nel componente usa toSignal() e nel template chiama il signal.',
        },
      ],
      // Le copertine arrivano da URL esterni: NgOptimizedImage non serve ovunque
      '@angular-eslint/template/prefer-ngsrc': 'off',
    },
  },
  // tag.html: nei `[class.x]="severity() === 'primary'"` il plugin scambia 'primary' per una classe
  {
    files: ['src/app/shared/components/tag/tag.html'],
    rules: { 'better-tailwindcss/no-unknown-classes': 'off' },
  },
);
