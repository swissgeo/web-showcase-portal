import { type GeocodingResult, queryGeoadmin } from '@geospatial-sdk/geocoding'

import type { Language } from '@/types/language'
import type { SupportedSr } from '@/types/projection'

import { PARCEL_SEARCH_ORIGINS } from '@/search/mapUrlUtils'
import { useSearchStore } from '@/store/search'

export default function useParcelSearch() {
    const searchStore = useSearchStore()

    const callback = (records: GeocodingResult[]) => {
        if (searchStore.searchTerm) {
            searchStore.setSearchParcelResults(records)
        }
        searchStore.setIsSearchingParcels(false)
    }

    const searchParcels = (value: string, sr: SupportedSr, lang: Language, limit: number) => {
        searchStore.setIsSearchingParcels(true)
        // 'address', 'zipcode', 'district', 'kantone', 'gazetteer', 'address', 'parcel'
        queryGeoadmin(value, {
            sr,
            lang: lang as 'en' | 'de' | 'fr' | 'it' | 'rm',
            limit,
            origins: PARCEL_SEARCH_ORIGINS,
        })
            .then((response: GeocodingResult[]) => {
                callback(response)
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.debug('Error in address search:', error)
                searchStore.setIsSearchingParcels(false)
            })
    }

    return { searchParcels }
}
