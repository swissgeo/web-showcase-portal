import type { GeocodingResult } from '@geospatial-sdk/geocoding'

import { defineStore } from 'pinia'

import type { GeonetworkRecord } from '@/types/gnRecord'

export interface SearchStoreState {
    searchTerm: string | null
    searchResults: GeonetworkRecord[]
    searchLocationResults: GeocodingResult[]
    searchResultTotal: number
}

export const useSearchStore = defineStore('search', {
    state: (): SearchStoreState => {
        return {
            searchTerm: null as string | null,
            searchResults: [] as GeonetworkRecord[],
            searchLocationResults: [] as GeocodingResult[],
            searchResultTotal: 0,
        }
    },
    actions: {
        setSearchResults(results: GeonetworkRecord[]) {
            this.searchResults = results
        },
        setSearchLocationResults(results: GeocodingResult[]) {
            this.searchLocationResults = results
        },
        setSearchResultTotal(total: number) {
            this.searchResultTotal = total
        },
        setSearchTerm(term: string) {
            this.searchTerm = term
        },

        clear() {
            this.searchLocationResults = []
            this.searchResults = []
            this.searchTerm = null
            this.searchResultTotal = 0
        },
    },
})
