import { onMounted } from 'vue'

import { type GeonetworkRecord } from '@/types/gnRecord.d'

export default function useGeocatSearch() {
    const GNUI = window.GNUI

    onMounted(() => {
        GNUI.init('https://www.geocat.ch/geonetwork/srv/api')
    })

    const searchGeocat = (
        value: string,
        callback: (records: GeonetworkRecord[], count: number) => void,
        offset = 0,
        limit = 20
    ) => {
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
    }

    return { searchGeocat }
}
