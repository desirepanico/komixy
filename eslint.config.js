// @ts-check
// @ts-ignore
const eslint = require('@eslint/js');
// @ts-ignore
const tseslint = require('typescript-eslint');
// @ts-ignore
const angular = require('angular-eslint');

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
    },
  },
  ...featureRules('src/app/features/**', ['^@features/(?!.*/services/[^/]+-navigation/)']),
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended],
    rules: {
      '@angular-eslint/template/prefer-control-flow': 'error',
      // Le copertine arrivano da URL esterni: NgOptimizedImage non serve ovunque
      '@angular-eslint/template/prefer-ngsrc': 'off',
    },
  },
);
