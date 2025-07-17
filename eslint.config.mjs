import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import onlyWarn from 'eslint-plugin-only-warn';
import tslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config} */
export default [
  eslint.configs.recommended,
  prettier,
  ...tslint.configs.recommended,
  {
    plugins: { onlyWarn },
    rules: {
      // disable some strict typescript rules
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      // custom rules
      'semi': 'warn',
      'prefer-arrow-callback': 'warn',
      'prefer-template': 'warn',
      'eqeqeq': 'warn',
    },
  },
];
