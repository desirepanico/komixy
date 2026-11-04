// @ts-check
// @ts-ignore
const eslint = require('@eslint/js');
// @ts-ignore
const tseslint = require('typescript-eslint');
// @ts-ignore
const angular = require('angular-eslint');

// defineConfig sostituisce tseslint.config (deprecato)
const { defineConfig } = require('eslint/config');

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
  {
    // La navigazione passa dal servizio di navigazione della feature (vedi .claude/rules/angular.md)
    files: ['src/app/features/**/pages/**/*.ts', 'src/app/features/**/components/**/*.ts'],
    ignores: ['**/*.spec.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@angular/router',
              importNames: ['Router'],
              message: 'Naviga con il servizio di navigazione della feature, non con Router.',
            },
          ],
          patterns: [
            {
              group: ['@shared/constants/app-routes/*'],
              message: 'I percorsi si costruiscono nel servizio di navigazione della feature.',
            },
          ],
        },
      ],
    },
  },
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
