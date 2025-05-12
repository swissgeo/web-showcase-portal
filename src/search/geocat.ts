import { Subscription } from 'rxjs'
import { onMounted } from 'vue'

import { useSearchStore } from '@/store/search'
import { type GeonetworkRecord } from '@/types/gnRecord.d'

export default function useGeocatSearch() {
    const GNUI = window.GNUI
    let subscription: Subscription | null = null

    const searchStore = useSearchStore()

    onMounted(() => {
        GNUI.init('https://www.geocat.ch/geonetwork/srv/api')
    })

    const cancelSearch = () => {
        if (subscription) {
            subscription.unsubscribe()
            searchStore.setIsSearchingGeocat(false)
        }
    }

    const searchCallback = ({ records, count }: { records: GeonetworkRecord[]; count: number }) => {
        // eslint-disable-next-line no-console
        console.log(records)
        subscription = null

        // guarding against a pecularity: if the user deletes the search
        // entry with backspace, then it might be the case that a search is still
        // being triggered due to debouncing. Then when it returns there will be search results
        // even if there shouldn't be any. Even cancelling the search could still mean
        // the promise is already underway to being resolved

        if (searchStore.searchTerm) {
            searchStore.appendGeocatSearchResults(records)
            searchStore.setSearchResultTotal(count)
            searchStore.incGeocatPage()
        }
        searchStore.setIsSearchingGeocat(false)
    }

    const searchGeocat = (value: string) => {
        // if there's a request ongoing, we cancel that
        cancelSearch()
        searchStore.setIsSearchingGeocat(true)

        subscription = GNUI.recordsRepository
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
            .subscribe(searchCallback)
    }

    return { searchGeocat, cancelSearch }
}
