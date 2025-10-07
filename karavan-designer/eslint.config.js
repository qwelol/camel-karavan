import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';

export default defineConfig(
    { ignores: ['dist', 'node_modules', 'public'] },
    {
        extends: [eslint.configs.recommended, importPlugin.flatConfigs.typescript, ...tseslint.configs.recommended],
        files: ['src/**/*.ts', 'src/**/*.tsx'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
        },

        plugins: { prettier },
        rules: {
            'prettier/prettier': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    varsIgnorePattern: '^_',
                    argsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-explicit-any': 'off',
            'import/no-unused-modules': ['error', { unusedExports: true }],
        },
    },
);
