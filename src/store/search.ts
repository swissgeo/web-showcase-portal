import type { GeocodingResult } from '@geospatial-sdk/geocoding'

import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { GeonetworkRecord } from '@/types/gnRecord'

import { SEARCH_RESULTS_DESKTOP_COLUMN_DEFAULT_WIDTH } from '@/search'
import { useTriggerSearch } from '@/search/triggerSearch.composable'

export interface SearchStoreState {
    // if the address search is currently making a request
    isSearchingAddresses: boolean
    isSearchingGeocat: boolean
    searchTerm: string | null
    geocatSearchResults: GeonetworkRecord[]
    searchLocationResults: GeocodingResult[]
    searchResultTotal: number
    geocatPage: number
    dataSearchPanelWidth: number
    isOpenSearch: boolean
    readonly geocatPageSize: 20
    selectedFederalIds: number[]
    selectedCantonalIds: number[]
    selectedCommunalIds: number[]
}

export const useSearchStore = defineStore('search', () => {
    const { triggerGeocatSearch } = useTriggerSearch()

    // state
    const isSearchingAddresses = ref(false)
    const isSearchingGeocat = ref(false)
    const isOpenSearch = ref(false)
    const searchTerm = ref<string | null>(null)
    const geocatSearchResults = ref<GeonetworkRecord[]>([])
    const searchLocationResults = ref<GeocodingResult[]>([])
    const searchResultTotal = ref(0)
    const geocatPage = ref(0)
    const dataSearchPanelWidth = ref(SEARCH_RESULTS_DESKTOP_COLUMN_DEFAULT_WIDTH)
    const geocatPageSize = 20
    const selectedFederalIds = ref<number[]>([])
    const selectedCantonalIds = ref<number[]>([])
    const selectedCommunalIds = ref<number[]>([])

    // actions
    function appendGeocatSearchResults(results: GeonetworkRecord[]) {
        geocatSearchResults.value.push(...results)
    }
    function setSearchLocationResults(results: GeocodingResult[]) {
        searchLocationResults.value = results
    }
    function setSearchResultTotal(total: number) {
        searchResultTotal.value = total
    }
    function setDataSearchPanelWidth(newWidth: number) {
        dataSearchPanelWidth.value = newWidth
    }
    function setSearchTerm(term: string | null) {
        searchTerm.value = term
    }
    function setIsSearchingAddresses(value: boolean) {
        isSearchingAddresses.value = value
    }
    function setIsSearchingGeocat(value: boolean) {
        isSearchingGeocat.value = value
    }
    function setIsOpenSearch(value: boolean) {
        isOpenSearch.value = value
    }
    function incGeocatPage() {
        geocatPage.value++
    }
    function resetSearch() {
        geocatSearchResults.value = []
        searchLocationResults.value = []
        searchTerm.value = null
        isSearchingAddresses.value = false
        isSearchingGeocat.value = false
        geocatPage.value = 0
        searchResultTotal.value = 0
    }
    function setGeocatSearchResults(results: GeonetworkRecord[]) {
        geocatSearchResults.value = results
    }
    function setSelectedFederalIds(ids: number[]) {
        selectedCantonalIds.value = []
        selectedCommunalIds.value = []
        selectedFederalIds.value = ids
        geocatSearchResults.value = []
        triggerGeocatSearch()
    }
    function setSelectedCantonalIds(ids: number[]) {
        selectedFederalIds.value = []
        selectedCommunalIds.value = []
        selectedCantonalIds.value = ids
        geocatSearchResults.value = []
        triggerGeocatSearch()
    }
    function setSelectedCommunalIds(ids: number[]) {
        selectedFederalIds.value = []
        selectedCantonalIds.value = []
        selectedCommunalIds.value = ids
        geocatSearchResults.value = []
        triggerGeocatSearch()
    }

    return {
        // state
        isSearchingAddresses,
        isSearchingGeocat,
        isOpenSearch,
        searchTerm,
        geocatSearchResults,
        searchLocationResults,
        searchResultTotal,
        geocatPage,
        dataSearchPanelWidth,
        geocatPageSize,
        selectedFederalIds,
        selectedCantonalIds,
        selectedCommunalIds,
        // actions
        appendGeocatSearchResults,
        setSearchLocationResults,
        setSearchResultTotal,
        setDataSearchPanelWidth,
        setSearchTerm,
        setIsSearchingAddresses,
        setIsSearchingGeocat,
        setIsOpenSearch,
        incGeocatPage,
        resetSearch,
        setGeocatSearchResults,
        setSelectedFederalIds,
        setSelectedCantonalIds,
        setSelectedCommunalIds,
    }
})
