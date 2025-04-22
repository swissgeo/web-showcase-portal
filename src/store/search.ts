import { defineStore } from 'pinia'

import type { GeonetworkRecord } from '@/types/gnRecord'

export interface SearchStoreState {
    searchTerm: string | null
    searchResults: GeonetworkRecord[]
}

export const useSearchStore = defineStore('search', {
    state: (): SearchStoreState => {
        return {
            searchTerm: null as string | null,
            searchResults: [] as GeonetworkRecord[],
        }
    },
    actions: {
        setSearchResults(results: GeonetworkRecord[]) {
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
