import { computed } from 'vue'

import { useSearchStore } from '@/store/search'

const searchStore = useSearchStore()

export default function useSearchResults() {
    const showAddressSpinner = computed(() => {
        return searchStore.isSearchingAddresses
    })

    const showSpinner = computed(() => {
        return searchStore.isSearchingGeocat
    })

    const addressSearchResultCount = computed(() => {
        return searchStore.searchResults.length
    })

    const geocatSearchResultCount = computed(() => {
        return searchStore.searchResultTotal
    })

    const isSearching = computed(() => {
        return searchStore.searchTerm
    })

    return {
        showAddressSpinner,
        isSearching,
        showSpinner,
        addressSearchResultCount,
        geocatSearchResultCount,
    }
}
