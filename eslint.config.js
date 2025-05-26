import markdown from '@eslint/markdown'
import pluginVitest from '@vitest/eslint-plugin'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pluginCypress from 'eslint-plugin-cypress/flat'
import mocha from 'eslint-plugin-mocha'
import perfectionist from 'eslint-plugin-perfectionist'
import pluginVue from 'eslint-plugin-vue'
import { globalIgnores } from 'eslint/config'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
    {
        name: 'app/files-to-lint',
        files: ['**/*.{ts,mts,tsx,vue}'],
    },

    globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', 'geonetwork-ui/*']),

    pluginVue.configs['flat/recommended'],
    vueTsConfigs.recommended,

    {
        plugins: {
            mocha,
            perfectionist,
        },

        rules: {
            eqeqeq: ['error', 'always'],

            'no-console': 'error',
            'no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                },
            ],
            'no-var': 'error',
            'perfectionist/sort-imports': [
                'error',
                { type: 'alphabetical', internalPattern: ['^@/.*'] },
            ],
            'vue/html-indent': ['error', 4],
            'mocha/no-exclusive-tests': 'error',
        },
    },

    {
        ...pluginVitest.configs.recommended,
        files: ['src/**/__tests__/*'],
    },

    {
        ...pluginCypress.configs.recommended,
        files: [
            'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}',
            'cypress/support/**/*.{js,ts,jsx,tsx}',
        ],
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        // switching to TypeScript unused var rule (instead of JS rule), so that no error is raised
        // on unused param from abstract function arguments
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'error',
        },
    },
    {
        files: ['**/*.md'],
        ignores: ['!**/*.md', '**/LICENSE.md'],
        plugins: {
            markdown: markdown,
        },
        processor: 'markdown/markdown',
        rules: {
            'no-irregular-whitespace': 'off',
        },
    },
    skipFormatting
)
