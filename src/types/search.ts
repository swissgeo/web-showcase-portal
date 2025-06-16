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
