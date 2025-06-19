import { createI18n } from 'vue-i18n'

import deLocale from '@/locales/de.json'
import enLocale from '@/locales/en.json'
import frLocale from '@/locales/fr.json'
import itLocale from '@/locales/it.json'
import rmLocale from '@/locales/rm.json'

const OFFICIAL_SWISS_LANG = ['de', 'fr', 'it', 'rm']
export const SUPPORTED_LANG = ['en', ...OFFICIAL_SWISS_LANG]

export type Language = (typeof SUPPORTED_LANG)[number]

export const isLanguageSupported = (str: string): str is Language => {
    return SUPPORTED_LANG.includes(str as Language)
}

export function getBrowserLanguage() {
    const language = navigator.language
    const lang = language.split('-')[0]
    if (isLanguageSupported(lang)) {
        return lang
    } else {
        return 'en'
    }
}

export function langToLocal(lang: Language): Language {
    return OFFICIAL_SWISS_LANG.includes(lang) ? `${lang}-CH` : lang
}

const i18nMessages = {
    de: deLocale,
    fr: frLocale,
    it: itLocale,
    en: enLocale,
    rm: rmLocale,
}

export const i18n = createI18n({
    locale: langToLocal(getBrowserLanguage()),
    messages: i18nMessages,
    legacy: false,
    // no error if missing translation, just display the input untranslated.
    missingWarn: false,
    fallbackWarn: false,
})
