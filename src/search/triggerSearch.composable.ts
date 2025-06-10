import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { SEARCH_DEBOUNCE_DELAY } from '@/search'
import useAddressSearch from '@/search/address'
import useGeocat from '@/search/geocat'
import { debounce } from '@/utils/debounce'

export function useTriggerSearch() {
    const addressSearch = useAddressSearch()
    const geocatSearch = useGeocat()
    const { locale } = useI18n()
    const localeString = computed(() => {
        return locale.value.split('-')[0]
    })

    const triggerSearch = debounce((value: string) => {
        geocatSearch.searchGeocat(value)
        addressSearch.searchAddress(value, '2056', localeString.value, 20)
    }, SEARCH_DEBOUNCE_DELAY)

    return {
        triggerSearch
    }
}
