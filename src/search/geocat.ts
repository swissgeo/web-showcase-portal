import { onMounted } from 'vue'

import { useSearchStore } from '@/store/search'
import { type GeonetworkRecord } from '@/types/gnRecord.d'

export default function useGeocatSearch() {
    const GNUI = window.GNUI

    const searchStore = useSearchStore()

    onMounted(() => {
        GNUI.init('https://www.geocat.ch/geonetwork/srv/api')
    })

    const searchCallback = (records: GeonetworkRecord[], count: number) => {
        // guarding against a pecularity: if the user deletes the search
        // entry with backspace, then it might be the case that a search is still
        // being triggered due to debouncing. Then when it returns there will be search results
        // even if there shouldn't be any
        if (searchStore.searchTerm) {
            searchStore.appendGeocatSearchResults(records)
            searchStore.setSearchResultTotal(count)
            searchStore.incGeocatPage()
        }
        searchStore.setIsSearchingGeocat(false)
    }

    const searchGeocat = (value: string) => {
        GNUI.recordsRepository
            .search({
                filters: {
                    any: value,
                    linkProtocol: '/OGC:WMT?S.*/',
                },
                offset: searchStore.geocatPage,
                limit: searchStore.geocatPageSize,
                sort: ['desc', '_score'],
                // remove this prop to get all the data
                // in time we'll have to figure out here what exactly we need
                // fields: ['resourceTitleObject', 'link', 'uuid', 'ownerOrganization'],
            })
            .subscribe(({ records, count }: { records: GeonetworkRecord[]; count: number }) => {
                // eslint-disable-next-line no-console
                console.log(records)
                searchCallback(records, count)
            })
    }

    return { searchGeocat }
}
