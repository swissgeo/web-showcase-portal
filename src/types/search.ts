export type SearchKeywordUseCaseConfig = {
    useCases: SearchKeywordUseCase[]
}

export type SearchKeywordUseCase = {
    keyword: {
        [language: string]: string
    }
    geocatIds: string[]
}
