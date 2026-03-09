// i18n configuration for DanceScore
const translations = {
    en: { appName: 'DanceScore', description: 'Upload dance performance to get scored on technique' },
    de: { appName: 'DanceScore', description: 'Upload dance performance to get scored on technique (DE)' },
} as const

export type Locale = keyof typeof translations
export const defaultLocale: Locale = 'en'
export const supportedLocales = Object.keys(translations) as Locale[]

export function t(key: keyof typeof translations.en, locale: Locale = defaultLocale): string {
    return translations[locale]?.[key] ?? translations.en[key] ?? key
}

export default translations
