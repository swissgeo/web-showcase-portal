import type { GeocodingResult } from '@geospatial-sdk/geocoding'

import { defineStore } from 'pinia'

import type { GeonetworkRecord } from '@/types/gnRecord'

export interface SearchStoreState {
    // if the address search is currently making a request
    isSearchingAddresses: boolean
    isSearchingGeocat: boolean
    searchTerm: string | null
    searchResults: GeonetworkRecord[]
    searchLocationResults: GeocodingResult[]
    searchResultTotal: number
}

export const useSearchStore = defineStore('search', {
    state: (): SearchStoreState => {
        return {
            isSearchingAddresses: false,
            isSearchingGeocat: false,
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
        setSearchTerm(term: string | null) {
            this.searchTerm = term
        },
        setIsSearchingAddresses(value: boolean) {
            this.isSearchingAddresses = value
        },
        setIsSearchingGeocat(value: boolean) {
            this.isSearchingGeocat = value
        },
    },
})
