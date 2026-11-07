// @ts-check
// @ts-ignore
const eslint = require('@eslint/js');
// @ts-ignore
const tseslint = require('typescript-eslint');
// @ts-ignore
const angular = require('angular-eslint');

// defineConfig sostituisce tseslint.config (deprecato)
const { defineConfig } = require('eslint/config');

// Regole sugli import delle feature (vedi .claude/rules/angular.md):
// - tra feature si importano solo i servizi di navigazione (`regexVietate`);
// - pagine e componenti non usano Router né AppRoutes: navigano con i servizi di navigazione.
function regoleFeature(cartella, regexVietate) {
  const patterns = regexVietate.map((regex) => ({
    regex,
    message: "Una feature importa da un'altra solo i servizi di navigazione (<nome>-navigation).",
  }));
  const pagineEComponenti = [`${cartella}/pages/**/*.ts`, `${cartella}/components/**/*.ts`];
  return [
    {
      files: [`${cartella}/*.ts`],
      ignores: ['**/*.spec.ts'],
      rules: { 'no-restricted-imports': ['error', { patterns }] },
    },
    {
      files: pagineEComponenti,
      ignores: ['**/*.spec.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
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
            ],
            patterns,
          },
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
    },
  },
  ...regoleFeature('src/app/features/**', ['^@features/(?!.*/services/[^/]+-navigation/)']),
  // discover mostra la card della classifica (unica eccezione oltre ai servizi di navigazione)
  ...regoleFeature('src/app/features/discover/**', [
    '^@features/(?!ranking/components/|.*/services/[^/]+-navigation/)',
  ]),
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
