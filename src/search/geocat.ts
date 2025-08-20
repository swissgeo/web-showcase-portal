import { catchError, Subscription } from 'rxjs'
import { watch } from 'vue'

import { defaultLayerOpacity } from '@/config/map.config'
import { convertLv95ToWgs84 } from '@/config/projection.config'
import { useSearchFilter } from '@/search/searchFilter.composable'
import { useMainStore } from '@/store/main'
import { useMapStore } from '@/store/map'
import { useSearchStore } from '@/store/search'
import { type GeonetworkRecord } from '@/types/gnRecord.d'
import { LayerType, type Layer } from '@/types/layer'
import { GEOCAT_SEARCH_URL, type SearchKeywordLayer } from '@/types/search'
import { useLanguage } from '@/utils/language.composable'

import { includeKGKGroup, getKGKGroup } from './geocatGroups'

const KGK_ORGANIZATION_NAME = 'KGK-CGC'

export default function useGeocat() {
    const GNUI = window.GNUI
    let subscription: Subscription | null = null

    const searchStore = useSearchStore()
    const mainStore = useMainStore()
    const mapStore = useMapStore()
    const { localeString } = useLanguage()
    const { isCantonFilterActive } = useSearchFilter()

    const cancelSearch = () => {
        if (subscription) {
            subscription.unsubscribe()
        }
    }

    function initializeGNUI() {
        GNUI.init({
            apiUrl: GEOCAT_SEARCH_URL,
            textLanguage: localeString.value,
            // TODO DEV NOTE: There seems to be a bug in GNUI that impacts the search results after changing the language but only when metadataLanguage is set. see GPS-205
            // metadataLanguage: langToLabelKey(localeString.value),
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
                const isKGKRecordA = a.ownerOrganization.name === KGK_ORGANIZATION_NAME
                const isKGKRecordB = b.ownerOrganization.name === KGK_ORGANIZATION_NAME

                // In line with geodienste.che we add logic here for KGK results
                // Each canton should have at least one KGK result and KGK results should be at the top
                return Number(isKGKRecordB) - Number(isKGKRecordA)
            })

            if (searchStore.geocatPage === 0) {
                searchStore.geocatSearchResults = sortedRecords
            } else {
                searchStore.geocatSearchResults = [
                    ...searchStore.geocatSearchResults,
                    ...sortedRecords,
                ]
            }
            searchStore.setSearchResultTotal(count)
            searchStore.setIsSearchingGeocat(false)
        }
    }

    const recordCallback = (record: GeonetworkRecord) => {
        if (record) {
            // eslint-disable-next-line no-console
            console.log('Record info:', record)
            mainStore.setInfoLayerRecord(record)
        }
    }

    const searchGeocat = (value: string, groupIds?: number[] | null, resetResults = false) => {
        if (searchStore.isSearchingGeocat) {
            return
        }

        cancelSearch()
        searchStore.setIsSearchingGeocat(true)

        const filters: Record<string, unknown> = {
            any: value,
            linkProtocol: '/OGC:WMT?S.*/',
        }

        if (groupIds && groupIds.length) {
            let filteredGroupIds = groupIds

            if (isCantonFilterActive.value) {
                filteredGroupIds = includeKGKGroup(groupIds)
            } else {
                const kgkGroupId = getKGKGroup()?.id
                if (kgkGroupId) {
                    filteredGroupIds = groupIds.filter((id) => id !== kgkGroupId)
                }
            }

            filters.groupOwner = `(${filteredGroupIds.map((id) => `groupOwner:"${id}"`).join(' OR ')})`
        }

        const extent = mapStore.visibleExtent
        let filterGeometry: { type: string; coordinates: [number, number][][] } | null = null
        if (searchStore.isExtentFilterActive) {
            filterGeometry = createExtentFilterGeometry(extent)
        }

        if (resetResults || searchStore.geocatPage === 0) {
            searchStore.geocatSearchResults = []
            searchStore.geocatPage = 0
            setTimeout(() => {
                const resultList = document.querySelector('[data-cy="div-geocat-search-results"]')
                if (resultList) {
                    resultList.scrollTop = 0
                }
            }, 0)
        }
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
                ...(filterGeometry ? { filterGeometry } : {}),
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

    const getRecordDetailsAsync = (uuid: string): Promise<GeonetworkRecord | null> => {
        return new Promise<GeonetworkRecord | null>((resolve) => {
            GNUI.recordsRepository.getRecord(uuid).subscribe({
                next: (record: GeonetworkRecord) => {
                    resolve(record)
                },
                error: (error: Error) => {
                    // eslint-disable-next-line no-console
                    console.error('Error fetching record details:', error)
                    resolve(null)
                },
            })
        })
    }

    function replaceGeocatLayers(records: GeonetworkRecord[], layers: Layer[]): void {
        const sortedRecords = layers
            .filter((layer) => layer.type === LayerType.Geonetwork)
            .map((layer) => records.find((record) => record.uniqueIdentifier === layer.id))
            .filter((record): record is GeonetworkRecord => !!record)

        sortedRecords.forEach((record: GeonetworkRecord) => {
            const existingLayer = mainStore.getLayerById(record.uniqueIdentifier)
            mainStore.replaceLayerOnMap({
                id: record.uniqueIdentifier,
                name: record.title,
                geonetworkRecord: record,
                opacity: existingLayer?.opacity ?? 1,
                visible: existingLayer?.visible ?? true,
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
                            ?.opacity ?? defaultLayerOpacity,
                    visible: true,
                    type: LayerType.Geonetwork,
                })
            }
        })
    }

    function createExtentFilterGeometry(
        extent: [[number, number], [number, number]]
    ): { type: string; coordinates: [number, number][][] } | null {
        // extent should be an array of two points: [ [minX, minY], [maxX, maxY] ]
        if (!extent || extent.length !== 2) return null
        const [[minX, minY], [maxX, maxY]] = extent
        const polygonLV95: [number, number][] = [
            [minX, minY],
            [maxX, minY],
            [maxX, maxY],
            [minX, maxY],
            [minX, minY],
        ]
        const polygonWGS84 = polygonLV95.map(convertLv95ToWgs84)
        return {
            type: 'Polygon',
            coordinates: [polygonWGS84],
        }
    }

    watch(
        () => mapStore.visibleExtent,
        (newExtent, oldExtent) => {
            if (
                searchStore.isExtentFilterActive &&
                JSON.stringify(newExtent) !== JSON.stringify(oldExtent)
            ) {
                searchGeocat(searchStore.searchTerm || '', undefined, true)
            }
        },
        { deep: true }
    )

    return {
        setGNUILanguage,
        initializeGNUI,
        searchGeocat,
        cancelSearch,
        getRecordDetails,
        getRecordDetailsAsync,
        searchConfigGeocat,
    }
}
