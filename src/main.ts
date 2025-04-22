import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import deLocale from './locales/de.json'
import './assets/main.css'

import '@fontsource/noto-sans'

import router from './router'

const messages = {
    de: deLocale,
}

const i18n = createI18n({
    locale: 'de',
    fallbackLocale: 'de',
    messages,
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(i18n)
app.mount('#app')
