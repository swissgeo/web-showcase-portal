import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { SEARCH_DEBOUNCE_DELAY } from '@/search'
import useAddressSearch from '@/search/address'
import useGeocat from '@/search/geocat'
import { useSearchStore } from '@/store/search'
import { debounce } from '@/utils/debounce'

export function useTriggerSearch() {
    const addressSearch = useAddressSearch()
    const geocatSearch = useGeocat()
    const searchStore = useSearchStore()
    const { locale } = useI18n()
    const localeString = computed(() => {
        return locale.value.split('-')[0]
    })
    const selectedGroupIds: ComputedRef<number[]> = computed(() => [
        ...(Array.isArray(searchStore.selectedFederal) ? searchStore.selectedFederal : []),
        ...(Array.isArray(searchStore.selectedCantonal) ? searchStore.selectedCantonal : []),
        ...(Array.isArray(searchStore.selectedCommunal) ? searchStore.selectedCommunal : []),
    ])

    const triggerSearch = debounce(() => {
        const searchValue = searchStore.searchTerm?.trim() || ''
        geocatSearch.searchGeocat(searchValue, selectedGroupIds.value.length ? selectedGroupIds.value : null)
        addressSearch.searchAddress(searchValue, '2056', localeString.value, 20)
    }, SEARCH_DEBOUNCE_DELAY)

    const triggerGeocatSearch = debounce(() => {
        const searchValue = searchStore.searchTerm?.trim() || ''
        geocatSearch.searchGeocat(searchValue, selectedGroupIds.value.length ? selectedGroupIds.value : null)
    }, SEARCH_DEBOUNCE_DELAY)

    return {
        triggerSearch,
        triggerGeocatSearch
    }
}
