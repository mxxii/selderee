import eslint from '@eslint/js';
import globals from 'globals';
import tsEslint from 'typescript-eslint';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import { defineConfig } from 'eslint/config';
import jsoncPlugin from 'eslint-plugin-jsonc';
import tsdocPlugin from 'eslint-plugin-tsdoc';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig(

  // Shared configuration
  eslint.configs.recommended,
  stylistic.configs.customize({
    quoteProps: 'consistent',
    semi: true,
    jsx: false,
  }),
  {
    ignores: [
      '.vscode/**',
      '**/lib/**',
      '**/node_modules/**',
      '**/package-lock.json',
    ],
  },

  // JS configuration
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin,
        ...globals.es2020,
      },
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/array-bracket-spacing': 'off',
      '@stylistic/no-multiple-empty-lines': ['error', { 'max': 2 }],
      '@stylistic/quotes': ['error', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': 'avoidEscape' }],
      '@stylistic/space-before-function-paren': ['error', 'always'],
      'no-var': 'error',
      'no-warning-comments': 'warn',
      'prefer-const': 'error',
    },
  },

  // TS configuration
  ...tsEslint.configs.recommendedTypeChecked.map(
    c => ({ ...c, files: ['**/*.ts'] }),
  ),
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: [
          'packages/selderee/tsconfig.json',
          'packages/selderee/test/tsconfig.json',
          'packages/plugin-htmlparser2/tsconfig.json',
          'packages/plugin-htmlparser2/test/tsconfig.json',
        ],
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        ...globals.nodeBuiltin,
        ...globals.es2020,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@stylistic': stylistic,
      'tsdoc': tsdocPlugin,
    },
    rules: {
      '@stylistic/array-bracket-spacing': 'off',
      '@stylistic/brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
      '@stylistic/indent': ['error', 2, {
        flatTernaryExpressions: true,
        offsetTernaryExpressions: true,
        SwitchCase: 1,
        tabLength: 2,
      }],
      '@stylistic/key-spacing': ['error', { mode: 'minimum' }],
      '@stylistic/max-statements-per-line': ['error', { 'max': 3 }],
      '@stylistic/multiline-ternary': 'off',
      '@stylistic/no-multi-spaces': 'off',
      '@stylistic/no-multiple-empty-lines': ['error', { 'max': 2 }],
      '@stylistic/object-curly-newline': ['error'],
      '@stylistic/operator-linebreak': 'off',
      '@stylistic/quotes': ['error', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': 'avoidEscape' }],
      '@stylistic/space-before-function-paren': ['error', 'always'],
      'no-var': 'error',
      'no-warning-comments': 'warn',
      // 'object-shorthand': ['error', 'always'],
      'prefer-const': 'error',
      'tsdoc/syntax': 'error',
    },
  },

  // JSON configuration
  ...jsoncPlugin.configs['flat/recommended-with-jsonc'],
  {
    files: ['*.json', '*.json5', '*.jsonc'],
    plugins: {
      'jsonc': jsoncPlugin,
    },
    rules: {
      'jsonc/array-bracket-newline': ['error', 'consistent'],
      'jsonc/array-element-newline': ['error', 'consistent'],
    },
  },

);
