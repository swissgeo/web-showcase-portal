import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

import { SwissGeo } from '@/stylePreset'

import App from './App.vue'
import deLocale from './locales/de.json'
import './assets/main.css'

import '@fontsource/noto-sans'
import '@geonetwork-ui/gn-standalone-search.js'

import router from './router'
import mapUrlPlugin from './store/plugins/map-url.plugin'

const messages = {
    de: deLocale,
}

const i18n = createI18n({
    locale: 'de',
    fallbackLocale: 'de',
    messages,
})

const app = createApp(App)
const pinia = createPinia()

pinia.use(mapUrlPlugin)

app.use(pinia)
app.use(router)

app.use(PrimeVue, {
    theme: {
        preset: SwissGeo,
        options: {
            // explicitly setting the dark mode toggle class
            // so that the browser preference isn't taken into account
            darkModeSelector: '.dark-mode',
        },
    },
})

app.use(i18n)
app.mount('#app')
