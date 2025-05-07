import { debounce } from '@/utils/debounce'
import {
    type GeocodingResult,
    queryGeoadmin,
} from '@geospatial-sdk/geocoding'

export default function useAddressSearch() {
    const searchAddress = debounce(
        (value: string, sr: '21781' | '2056' | '4326' | '3857', lang: 'de' | 'fr' | 'it' | 'rm' | 'en', limit: number, callback: (records: any[]) => void) => {
            queryGeoadmin(value, { sr, lang, limit, origins: ['address'] }).then((response: GeocodingResult[]) => {
                callback(response)
            })
        },
        200
    )

    return { searchAddress }
}
