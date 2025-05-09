import { onMounted } from 'vue'

import { SEARCH_DEBOUNCE_DELAY } from '@/search'
import { type GeonetworkRecord } from '@/types/gnRecord.d'
import { debounce } from '@/utils/debounce'

export default function useGeocatSearch() {
    const GNUI = window.GNUI

    onMounted(() => {
        GNUI.init('https://www.geocat.ch/geonetwork/srv/api')
    })

    const searchGeocat = debounce(
        (value: string, callback: (records: GeonetworkRecord[], count: number) => void) => {
            GNUI.recordsRepository
                .search({
                    filters: {
                        any: value,
                        linkProtocol: '/OGC:WMT?S.*/',
                    },
                    offset: 0,
                    limit: 20,
                    sort: ['desc', '_score'],
                    // remove this prop to get all the data
                    // in time we'll have to figure out here what exactly we need
                    // fields: ['resourceTitleObject', 'link', 'uuid', 'ownerOrganization'],
                })
                .subscribe(({ records, count }: { records: GeonetworkRecord[]; count: number }) => {
                    // eslint-disable-next-line no-console
                    console.log(records)
                    callback(records, count)
                })
        },
        SEARCH_DEBOUNCE_DELAY
    )

    return { searchGeocat }
}
