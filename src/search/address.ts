import {
    type GeocodingResult,
    queryGeoadmin,
} from '@geospatial-sdk/geocoding'

import type { Language } from '@/types/language'
import type { SupportedSr } from '@/types/projection'

import { LOCATION_SEARCH_ORIGINS } from '@/search/mapUrlUtils'
import { debounce } from '@/utils/debounce'

export default function useAddressSearch() {
    const searchAddress = debounce(
        (value: string, sr: SupportedSr, lang: Language, limit: number, callback: (records: GeocodingResult[]) => void) => {
            // 'address', 'zipcode', 'district', 'kantone', 'gazetteer', 'address', 'parcel'
            queryGeoadmin(value, { sr, lang, limit, origins: LOCATION_SEARCH_ORIGINS }).then((response: GeocodingResult[]) => {
                callback(response)
            })
        },
        200
    )

    return { searchAddress }
}
