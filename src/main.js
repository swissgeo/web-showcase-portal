import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import '@fontsource/noto-sans'

import deLocale from './locales/de.json'

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
