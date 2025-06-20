import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { SEARCH_DEBOUNCE_DELAY } from '@/search'
import useAddressSearch from '@/search/address'
import useGeocat from '@/search/geocat'
import { useSearchStore } from '@/store/search'
import { DEFAULT_SEARCH_SR } from '@/types/projection'
import { debounce } from '@/utils/debounce'

export function useTriggerSearch() {
    const addressSearch = useAddressSearch()
    const geocatSearch = useGeocat()
    const searchStore = useSearchStore()
    const { locale } = useI18n()
    const localeString = computed(() => {
        return locale.value.split('-')[0]
    })
    const selectedGroupIds: ComputedRef<number[] | null> = computed(() => {
        const ids = [
            ...(Array.isArray(searchStore.selectedFederalIds)
                ? searchStore.selectedFederalIds
                : []),
            ...(Array.isArray(searchStore.selectedCantonalIds)
                ? searchStore.selectedCantonalIds
                : []),
            ...(Array.isArray(searchStore.selectedCommunalIds)
                ? searchStore.selectedCommunalIds
                : []),
        ]
        return ids.length ? ids : null
    })

    const triggerSearch = debounce(() => {
        const searchValue = searchStore.searchTerm?.trim() || ''
        geocatSearch.searchGeocat(searchValue, selectedGroupIds.value)
        addressSearch.searchAddress(searchValue, DEFAULT_SEARCH_SR, localeString.value, 20)
    }, SEARCH_DEBOUNCE_DELAY)

    const triggerGeocatSearch = debounce(() => {
        const searchValue = searchStore.searchTerm?.trim() || ''
        geocatSearch.searchGeocat(searchValue, selectedGroupIds.value)
    }, SEARCH_DEBOUNCE_DELAY)

    return {
        triggerSearch,
        triggerGeocatSearch,
    }
}
