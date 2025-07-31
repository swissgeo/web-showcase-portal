import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import gitDescribe from 'git-describe'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, Plugin } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

// We take the version from APP_VERSION but if not set, then take
// it from git describe command
let appVersion = process.env.APP_VERSION
if (!appVersion) {
    // NOTE: git-describe package add sometimes `+` signs (what the real git describe command don't)
    // and the `+` sign on the URL is actually a space, so it should be percent encoded,.
    // Therefore we change the + sign into '-' for simplification.
    appVersion =
        'v' + gitDescribe.gitDescribeSync().semverString?.replace('+', '-') || ''
}

export default defineConfig(({ mode }) => {
    const config = {
        base: (process.env.BASE_PATH || './').toLowerCase(),
        build: {
            assetsDir: `${appVersion}/assets`,
        },
        plugins: [vue(), tailwindcss(), VitePluginSvgSpritemap('./src/assets/icons/*.svg', {})],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
                '@geonetwork-ui': fileURLToPath(new URL('./geonetwork-ui', import.meta.url)),
            },
        },
    }

    if (mode === 'development') {
        // avoid having the devtools in e2e tests
        config.plugins.push(vueDevTools() as Plugin<unknown>[])
    }

    return config
})
