import { catchError, Subscription } from 'rxjs'

import { useMainStore } from '@/store/main'
import { useSearchStore } from '@/store/search'
import { type GeonetworkRecord } from '@/types/gnRecord.d'
import { langToLabelKey } from '@/types/language'
import { LayerType, type Layer } from '@/types/layer'
import { GEOCAT_SEARCH_URL, type SearchKeywordLayer } from '@/types/search'
import { useLanguage } from '@/utils/language.composable'

import { includeKGKGroup } from './geocatGroups'

export default function useGeocat() {
    const GNUI = window.GNUI
    let subscription: Subscription | null = null

    const searchStore = useSearchStore()
    const mainStore = useMainStore()
    const { localeString } = useLanguage()

    const cancelSearch = () => {
        if (subscription) {
            subscription.unsubscribe()
        }
    }

    function initializeGNUI() {
        GNUI.init({
            apiUrl: GEOCAT_SEARCH_URL,
            textLanguage: localeString.value,
            metadataLanguage: langToLabelKey(localeString.value),
        })
    }

    function setGNUILanguage() {
        initializeGNUI()
        searchStore.geocatSearchResults = []
        // update the layers in the layer cart
        searchGeocatLayers(mainStore.layersOnMap)
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
            const sortedRecords = records.sort((a, b) => {
                const isKGKRecordA = a.ownerOrganization.name === "KGK-CGC"
                const isKGKRecordB = b.ownerOrganization.name === "KGK-CGC"
                return Number(isKGKRecordB) - Number(isKGKRecordA)
            })

            searchStore.appendGeocatSearchResults(sortedRecords)
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

    const searchGeocat = (value: string, groupIds?: number[] | null) => {
        cancelSearch()
        searchStore.setIsSearchingGeocat(true)

        const filters: Record<string, unknown> = {
            any: value,
            linkProtocol: '/OGC:WMT?S.*/',
        }
        if (groupIds && groupIds.length) {
            const uniqueGroupIds = includeKGKGroup(groupIds)
            filters.groupOwner = '(' + uniqueGroupIds.map((id) => `groupOwner:"${id}"`).join(' OR ') + ')'
        }

        // logs...

        subscription = GNUI.recordsRepository
            .search({
                filters,
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

    const searchConfigGeocat = (layers: SearchKeywordLayer[]) => {
        // if there's a request ongoing, we cancel that
        cancelSearch()

        subscription = GNUI.recordsRepository
            .search({
                filters: {
                    linkProtocol: '/OGC:WMT?S.*/',
                },
                offset: searchStore.geocatPage,
                limit: searchStore.geocatPageSize,
                filterIds: layers.map((layer) => layer.geocatId),
            })
            .pipe(
                catchError((error) => {
                    // eslint-disable-next-line no-console
                    console.error('Error during GeoCat search:', error)
                    return []
                })
            )
            .subscribe(({ records }: { records: GeonetworkRecord[] }) => {
                addConfigLayers(records, layers)
            })
    }

    const searchGeocatLayers = (layers: Layer[]) => {
        const geocatLayers = layers.filter((layer) => layer.type === LayerType.Geonetwork)
        // if there's a request ongoing, we cancel that
        subscription = GNUI.recordsRepository
            .search({
                filters: {
                    linkProtocol: '/OGC:WMT?S.*/',
                },
                offset: 0,
                limit: 500,
                filterIds: geocatLayers.map((layer) => layer.id),
            })
            .pipe(
                catchError((error) => {
                    // eslint-disable-next-line no-console
                    console.error('Error during GeoCat search:', error)
                    return []
                })
            )
            .subscribe(({ records }: { records: GeonetworkRecord[] }) => {
                replaceGeocatLayers(records, layers)
            })
    }

    // Helper functions
    const getRecordDetails = (uuid: string) => {
        GNUI.recordsRepository.getRecord(uuid).subscribe(recordCallback)
    }

    function replaceGeocatLayers(records: GeonetworkRecord[], layers: Layer[]): void {
        const sortedRecords = layers
            .filter((layer) => layer.type === LayerType.Geonetwork)
            .map((layer) => records.find((record) => record.uniqueIdentifier === layer.id))
            .filter((record): record is GeonetworkRecord => !!record)

        sortedRecords.forEach((record: GeonetworkRecord) => {
            mainStore.replaceLayerOnMap({
                id: record.uniqueIdentifier,
                name: record.title,
                geonetworkRecord: record,
                opacity: layers.find((layer) => layer.id === record.uniqueIdentifier)?.opacity ?? 1,
                visible: true,
                type: LayerType.Geonetwork,
            })
        })
    }

    function addConfigLayers(records: GeonetworkRecord[], layers: SearchKeywordLayer[]): void {
        const sortedRecords = layers
            .map((layer) => records.find((record) => record.uniqueIdentifier === layer.geocatId))
            .filter((record): record is GeonetworkRecord => !!record)
        sortedRecords.forEach((record: GeonetworkRecord) => {
            if (!mainStore.getLayerById(record.uniqueIdentifier)) {
                mainStore.addLayerToMap({
                    id: record.uniqueIdentifier,
                    name: record.title,
                    geonetworkRecord: record,
                    opacity:
                        layers.find((layer) => layer.geocatId === record.uniqueIdentifier)
                            ?.opacity ?? 1,
                    visible: true,
                    type: LayerType.Geonetwork,
                })
            }
        })
    }
    return {
        setGNUILanguage,
        initializeGNUI,
        searchGeocat,
        cancelSearch,
        getRecordDetails,
        searchConfigGeocat,
    }
}
