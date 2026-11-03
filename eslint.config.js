// @ts-check
// @ts-ignore
const eslint = require('@eslint/js');
// @ts-ignore
const tseslint = require('typescript-eslint');
// @ts-ignore
const angular = require('angular-eslint');

module.exports = tseslint.config(
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
      '@angular-eslint/no-host-metadata-property': 'off',
      '@angular-eslint/no-input-rename': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
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
