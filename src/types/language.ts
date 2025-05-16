export const languages = ['de', 'fr', 'it', 'rm', 'en'] as const

export type Language = typeof languages[number]

export const isLanguageSupported = (str: string): str is Language => {
    return languages.includes(str as Language)
}
