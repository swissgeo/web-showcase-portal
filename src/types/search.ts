export const GEOCAT_SEARCH_URL = 'https://www.geocat.ch/geonetwork/srv/api'

export interface SearchKeywordUseCaseConfig {
    useCases: SearchKeywordUseCase[]
}

export interface SearchKeywordUseCase {
    keyword: {
        [language: string]: string
    }
    layers: SearchKeywordLayer[]
}

export interface SearchKeywordLayer {
    geocatId: string
    opacity: number
}

export interface FilterGroup {
    label: string
    value?: number
}
