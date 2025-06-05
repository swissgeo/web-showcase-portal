import { defineConfig } from 'cypress'

export default defineConfig({
    e2e: {
        specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
        baseUrl: 'http://localhost:4173',
        chromeWebSecurity: false,
        numTestsKeptInMemory: 1,
        watchForFileChanges: false, // Prevent Cypress from automatically re-running tests on file changes
    },
    component: {
        specPattern: 'src/**/__tests__/*.{cy,spec}.{js,ts,jsx,tsx}',
        devServer: {
            framework: 'vue',
            bundler: 'vite',
        },
    },
})
