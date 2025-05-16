import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, Plugin } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }) => {
    const config = {
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
