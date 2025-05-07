import { defineStore } from 'pinia'

import type { GeonetworkRecord } from '@/types/gnRecord'

export interface SearchStoreState {
    searchTerm: string | null
    searchResults: GeonetworkRecord[]
    searchLocationResults: any[]
}

export const useSearchStore = defineStore('search', {
    state: (): SearchStoreState => {
        return {
            searchTerm: null as string | null,
            searchResults: [] as GeonetworkRecord[],
            searchLocationResults: [] as any[],
        }
    },
    actions: {
        setSearchResults(results: GeonetworkRecord[]) {
            this.searchResults = results
        },
        setSearchLocationResults(results: any[]) {
            this.searchLocationResults = results
        },
        setSearchTerm(term: string) {
            this.searchTerm = term
        },
        clear() {
            this.searchLocationResults = []
            this.searchResults = []
            this.searchTerm = null
        },
    },
})
