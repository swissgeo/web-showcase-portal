import { defineStore } from 'pinia'

export type Layer = {
    id: string
    name: string
}

export const useSearchStore = defineStore('search', {
    state: () => {
        return {
            searchTerm: null as string | null,
            searchResults: [] as Layer[],
        }
    },
    actions: {
        setSearchResults(results: Layer[]) {
            this.searchResults = results
        },
        setSearchTerm(term: string) {
            this.searchTerm = term
        },
        clear() {
            this.searchResults = []
            this.searchTerm = null
        },
    },
})
