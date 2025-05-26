import { catchError, Subscription } from 'rxjs'
import { onMounted } from 'vue'

import { useMainStore } from '@/store/main'
import { useSearchStore } from '@/store/search'
import { type GeonetworkRecord } from '@/types/gnRecord.d'

export default function useGeocat() {
    const GNUI = window.GNUI
    let subscription: Subscription | null = null

    const searchStore = useSearchStore()
    const mainStore = useMainStore()

    onMounted(() => {
        GNUI.init('https://www.geocat.ch/geonetwork/srv/api')
    })

    const cancelSearch = () => {
        if (subscription) {
            subscription.unsubscribe()
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
        }
        searchStore.setIsSearchingGeocat(false)
    }

    const recordCallback = (record: GeonetworkRecord) => {
        if (record) {
            // eslint-disable-next-line no-console
            console.log('Record info:', record)
            mainStore.setInfoLayerRecord(record)
        }
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
                offset: searchStore.geocatPage * searchStore.geocatPageSize,
                limit: searchStore.geocatPageSize,
                sort: ['desc', '_score'],
                // remove this prop to get all the data
                // the field names were deduced from looking at this code
                // https://github.com/geonetwork/geonetwork-ui/blob/c5432f39ff5649e8df1647bfd9eefc9a7c264061/libs/api/metadata-converter/src/lib/gn4/gn4.field.mapper.ts#L70
                fields: ['resourceTitleObject', 'link', 'contact', 'uuid'],
            })
            .pipe(
                catchError((error) => {
                    // eslint-disable-next-line no-console
                    console.error('Error during GeoCat search:', error)
                    return []
                })
            )
            .subscribe(searchCallback)
    }

    const searchConfigGeocat = (ids: string[]) => {
        // if there's a request ongoing, we cancel that
        cancelSearch()

        subscription = GNUI.recordsRepository
            .search({
                filters: {
                    linkProtocol: '/OGC:WMT?S.*/',
                },
                offset: searchStore.geocatPage,
                limit: searchStore.geocatPageSize,
                filterIds: ids,
            })
            .pipe(
                catchError((error) => {
                    // eslint-disable-next-line no-console
                    console.error('Error during GeoCat search:', error)
                    return []
                })
            )
            .subscribe(({ records }: { records: GeonetworkRecord[] }) => {
                // Sort records in the order of the ids
                const sortedRecords = ids
                    .map((id) => records.find((record) => record.uniqueIdentifier === id))
                    .filter((record): record is GeonetworkRecord => !!record)

                sortedRecords.forEach((record: GeonetworkRecord) => {
                    if (!mainStore.getLayerById(record.uniqueIdentifier)) {
                        mainStore.addLayerToMap({
                            id: record.uniqueIdentifier,
                            name: record.title,
                            geonetworkRecord: record,
                            opacity: 1,
                            visible: true,
                        })
                    }
                })
            })
    }

    const getRecordDetails = (uuid: string) => {
        GNUI.recordsRepository.getRecord(uuid).subscribe(recordCallback)
    }

    return { searchGeocat, cancelSearch, getRecordDetails, searchConfigGeocat }
}
