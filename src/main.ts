import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'

import { SwissGeo } from '@/stylePreset'
import { i18n } from '@/types/language'

import App from './App.vue'
import './assets/main.css'

import '@fontsource/inter'
import '@fontsource/geologica'
import '@fontsource/dm-sans'
import '@geonetwork-ui/gn-standalone-search.js'

import router from './router'
import mapUrlPlugin from './store/plugins/map-url.plugin'

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
            cssLayer: {
                name: 'primevue',
                order: 'theme, base, primevue, custom',
            },
        },
    },
})

app.use(i18n)
app.mount('#app')
