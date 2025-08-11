/**
 * Shared constants used across the application
 */

// External URLs
export const PROJECT_INFO_URL = 'https://www.geoinformation.ch/de/swissgeo-geoplattform'
export const PROJECT_INFO_URL_EN = 'https://www.geoinformation.ch/fr/swissgeo-geoplatform'
export const PROJECT_INFO_URL_IT = 'https://www.geoinformation.ch/de/swissgeo-geopiattaforma'

export function getProjectInfoUrl(lang: string): string {
    switch (lang) {
        case 'en':
            return PROJECT_INFO_URL_EN
        case 'it':
            return PROJECT_INFO_URL_IT
        default:
            return PROJECT_INFO_URL
    }
}
