import { type GeocodingResult, queryGeoadmin } from '@geospatial-sdk/geocoding'

import type { Language } from '@/types/language'
import type { SupportedSr } from '@/types/projection'

import { LOCATION_SEARCH_ORIGINS } from '@/search/mapUrlUtils'
import { useSearchStore } from '@/store/search'

export default function useAddressSearch() {
    const searchStore = useSearchStore()

    const callback = (records: GeocodingResult[]) => {
        if (searchStore.searchTerm) {
            searchStore.setSearchLocationResults(records)
        }
        searchStore.setIsSearchingAddresses(false)
    }

    const searchAddress = (value: string, sr: SupportedSr, lang: Language, limit: number) => {
        searchStore.setIsSearchingAddresses(true)
        // 'address', 'zipcode', 'district', 'kantone', 'gazetteer', 'address', 'parcel'
        queryGeoadmin(value, { sr, lang, limit, origins: LOCATION_SEARCH_ORIGINS }).then(
            (response: GeocodingResult[]) => {
                callback(response)
            }
        )
    }

    return { searchAddress }
}
