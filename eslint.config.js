import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import xo from 'eslint-config-xo';
import importPlugin from 'eslint-plugin-import';

export default defineConfig([
  {
    files: ['**/*.js'], // Target only JS files
    languageOptions: {
      sourceType: 'module', // Support ES modules
    },
    plugins: {
      import: importPlugin, // Enable import plugin for sorting
    },
    rules: {
      // XO for Airbnb-like style
      ...xo.rules,
      // ESLint recommended JS rules
      ...js.configs.recommended.rules,
      // Requested rules
      'comma-dangle': ['error', 'always-multiline'], // Trailing commas in arrays/objects (multiline only)
      'semi': ['error', 'always'], // Require semicolons
      'quotes': ['error', 'single'], // Enforce single quotes
      'no-console': 'error', // Disallow console.logs
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Warn on unused vars, ignore _
      'no-undef': 'warn', // From your original config
      // Import sorting
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      // Disable TypeScript rules to avoid errors
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },
]);
