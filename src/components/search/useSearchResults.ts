import { computed } from 'vue'

import { useSearchStore } from '@/store/search'

export default function useSearchResults() {
    const searchStore = useSearchStore()

    const showAddressSpinner = computed(() => {
        return searchStore.isSearchingAddresses
    })

    const showGeocatSpinner = computed(() => {
        return searchStore.isSearchingGeocat
    })

    const addressSearchResultCount = computed(() => {
        return searchStore.searchLocationResults.length
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
        showGeocatSpinner,
        addressSearchResultCount,
        geocatSearchResultCount,
    }
}
