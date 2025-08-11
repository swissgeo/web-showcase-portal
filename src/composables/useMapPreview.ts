import type BaseLayer from 'ol/layer/Base'

import axios from 'axios'
import { defaults as defaultControls } from 'ol/control'
import Feature from 'ol/Feature'
import WMSCapabilities from 'ol/format/WMSCapabilities'
import { Polygon } from 'ol/geom'
import { defaults as defaultInteractions } from 'ol/interaction'
import ImageLayer from 'ol/layer/Image'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import Map from 'ol/Map'
import { get as getProjection } from 'ol/proj'
import Static from 'ol/source/ImageStatic'
import VectorSource from 'ol/source/Vector'
import WMTS, { type RequestEncoding } from 'ol/source/WMTS'
import Stroke from 'ol/style/Stroke'
import Style from 'ol/style/Style'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import View from 'ol/View'
import { ref, type Ref } from 'vue'

import type { BoundingBox, CapabilitiesLayer, GeocatLayerInformation } from '@/types/mapPreview'

import { fetchGeocatalogLayer } from '@/api/topics.api'
import {
    EPSG_2056,
    EPSG_4326,
    getConfiguredProj4,
    registerProjections,
} from '@/config/projection.config'
import { useMapStore } from '@/store/map'

const SWISS_EXTENT = [2420000, 1050000, 2850000, 1350000]
const MIN_EXTENT_SIZE = 30000
const SWISS_TILE_RESOLUTIONS = [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750]

export const LONG_PRESS_TIMEOUT_MS = 500

const previewMap = ref<Map | null>(null)

// Used for async cancellation (must be shared with component)
let abortController: AbortController | null = null

export function useMapPreview() {
    const mapStore = useMapStore()
    const hasPreviewError: Ref<boolean> = ref(false)
    const isPreviewLoading: Ref<boolean> = ref(false)

    function registerProjection() {
        registerProjections()
        if (!getProjection(EPSG_2056)) {
            // eslint-disable-next-line no-console
            console.error(`${EPSG_2056} projection not registered!`)
            hasPreviewError.value = true
        }
    }

    function createBackgroundLayer(bgLayerName: string): TileLayer | undefined {
        const bgLayerUrl = `https://sys-wmts.dev.bgdi.ch/1.0.0/${bgLayerName}/default/current/2056/{TileMatrix}/{TileCol}/{TileRow}.jpeg`

        const bgLayerOptions = {
            layer: bgLayerName,
            url: bgLayerUrl,
            format: 'jpeg',
            matrixSet: EPSG_2056,
            projection: EPSG_2056,
            requestEncoding: 'REST' as RequestEncoding,
            cacheSize: 0,
            tileGrid: new WMTSTileGrid({
                origin: [2420000, 1350000],
                resolutions: SWISS_TILE_RESOLUTIONS,
                matrixIds: Array.from({ length: 28 }, (_, i) => i.toString()),
                extent: SWISS_EXTENT,
            }),
            style: 'default',
        }

        if (!bgLayerOptions.projection) {
            // eslint-disable-next-line no-console
            console.error('WMTS options or projection is null. Check matrixSet and layer name.')
            hasPreviewError.value = true
            return
        }

        const tileLayer = new TileLayer({
            source: new WMTS(bgLayerOptions),
            opacity: 1,
        })

        tileLayer.getSource()?.on('tileloaderror', listenTileLoadError.bind(null, bgLayerName))

        return tileLayer
    }

    async function initializeMap() {
        try {
            registerProjection()

            previewMap.value = new Map({
                layers: [], // Initialize with no layers
                view: new View({
                    projection: EPSG_2056,
                    center: [2650000, 1200000],
                    zoom: 6.5,
                }),
                controls: defaultControls({ zoom: false }),
                interactions: defaultInteractions({
                    dragPan: false,
                    mouseWheelZoom: false,
                }),
            })
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to initialize map:', error)
            hasPreviewError.value = true
        }
    }

    function addBackgroundLayer(bgLayerName: string): void {
        const bgLayer = createBackgroundLayer(bgLayerName)
        if (!bgLayer) {
            // eslint-disable-next-line no-console
            console.error('Failed to create WMTS layer.')
            return
        }
        previewMap.value?.addLayer(bgLayer)
    }

    function addLayer(layer: BaseLayer): void {
        previewMap.value?.addLayer(layer)
    }

    function resetMap(): void {
        if (!previewMap.value) {
            return
        }
        const backgroundLayer = previewMap.value
            .getLayers()
            .getArray()
            .find((layer) => layer instanceof TileLayer)
        unlistenMapEvents()
        previewMap.value.getLayers().clear()
        if (backgroundLayer) {
            previewMap.value.addLayer(backgroundLayer)
        }
    }

    function addLayerExtentToMap(extent?: [number, number, number, number]): void {
        if (!previewMap.value || !extent) {
            return
        }
        const coordinates = getExtentCoordinates(extent)
        const polygon = new Polygon([coordinates])
        const feature = new Feature({ geometry: polygon })
        feature.setStyle(
            new Style({
                stroke: new Stroke({ color: 'red', width: 2 }),
            })
        )

        const vectorLayer = new VectorLayer({
            source: new VectorSource({
                features: [feature],
            }),
        })
        previewMap.value.addLayer(vectorLayer)
    }

    function getExtentCoordinates(layerExtent: [number, number, number, number]): number[][] {
        let [minX, minY, maxX, maxY] = layerExtent
        const [seMinX, seMinY, seMaxX, seMaxY] = SWISS_EXTENT

        // Ensure a minimum difference of MIN_EXTENT_SIZE for both X and Y but not bigger than the Swiss extent
        if (maxX - minX < MIN_EXTENT_SIZE) {
            const adjustment = (MIN_EXTENT_SIZE - (maxX - minX)) / 2
            minX = Math.max(minX - adjustment, seMinX)
            maxX = Math.min(maxX + adjustment, seMaxX)
        } else {
            minX = Math.max(minX, seMinX)
            maxX = Math.min(maxX, seMaxX)
        }
        if (maxY - minY < MIN_EXTENT_SIZE) {
            const adjustment = (MIN_EXTENT_SIZE - (maxY - minY)) / 2
            minY = Math.max(minY - adjustment, seMinY)
            maxY = Math.min(maxY + adjustment, seMaxY)
        } else {
            minY = Math.max(minY, seMinY)
            maxY = Math.min(maxY, seMaxY)
        }
        return [
            [minX, minY], // Bottom-left corner
            [minX, maxY], // Top-left corner
            [maxX, maxY], // Top-right corner
            [maxX, minY], // Bottom-right corner
            [minX, minY], // Close polygon
        ]
    }

    function createWMSLayer(
        wmsBaseUrl: string,
        selectedLayerName: string,
        extent: [number, number, number, number] | undefined
    ): ImageLayer<Static> {
        const imageExtent = extent ?? SWISS_EXTENT
        // Some layers might still not be visibile in the preview,
        // this is due to the fact that the layers need a specific width and height at a certain zoom level
        // to be displayed correctly but we are on a fixed zoom level.
        // This problem is also present in the mapviewer.
        const layer = new ImageLayer({
            source: new Static({
                url: `${wmsBaseUrl}?SERVICE=WMS&REQUEST=GetMap&TRANSPARENT=true&LAYERS=${selectedLayerName}&FORMAT=image/png&VERSION=1.3.0&CRS=${EPSG_2056}&BBOX=${imageExtent.join(',')}&WIDTH=1153&HEIGHT=563`,
                imageExtent: imageExtent,
                projection: getProjection(EPSG_2056) ?? undefined,
            }),
        })
        // Listen for image load errors
        layer.getSource()?.on('imageloaderror', listenImageLoadError.bind(null, selectedLayerName))

        return layer
    }

    function listenImageLoadError(selectedLayerName: string): void {
        // eslint-disable-next-line no-console
        console.error('Image load error on WMS layer:', selectedLayerName)
        hasPreviewError.value = true
    }

    function listenTileLoadError(bgLayerName: string): void {
        // eslint-disable-next-line no-console
        console.error('Tile load error on WMTS background layer:', bgLayerName)
        hasPreviewError.value = true
    }

    function unlistenMapEvents(): void {
        if (!previewMap.value) {
            return
        }
        previewMap.value.getLayers().forEach((layer) => {
            if (layer instanceof ImageLayer || layer instanceof TileLayer) {
                layer
                    .getSource()
                    ?.un('imageloaderror', listenImageLoadError.bind(null, layer.get('name')))
                layer
                    .getSource()
                    ?.un('tileloaderror', listenTileLoadError.bind(null, layer.get('name')))
            }
        })
    }

    async function extractLayerExtent(
        wmsBaseUrl: string,
        selectedLayerName: string
    ): Promise<[number, number, number, number] | undefined> {
        let result: [number, number, number, number] | undefined
        try {
            isPreviewLoading.value = true
            cancelOngoingRequest()

            const layerResult = await getSelectedLayer(wmsBaseUrl, selectedLayerName)
            if (!layerResult || !layerResult.layer) {
                // eslint-disable-next-line no-console
                console.error(`Layer with name '${selectedLayerName}' not found in capabilities`)
                return result
            }
            const { layer: selectedLayer, parents } = layerResult
            const extent = getBoundingBoxExtent(selectedLayer, parents)
            if (!extent) {
                // eslint-disable-next-line no-console
                console.error(
                    `Bounding box with ${EPSG_2056} not found for layer '${selectedLayerName}'`
                )
                return result
            }

            result = extent
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to extract extent:', error)
            hasPreviewError.value = true
            return result
        } finally {
            isPreviewLoading.value = false
        }

        hasPreviewError.value = false
        return result
    }

    function cancelOngoingRequest(): void {
        if (abortController) {
            abortController.abort()
        }
    }

    async function getSelectedLayer(
        wmsBaseUrl: string,
        selectedLayerName: string
    ): Promise<{ layer?: CapabilitiesLayer; parents: CapabilitiesLayer[] } | undefined> {
        const cachedRootLayer = mapStore.getCachedPreviewRootLayer(wmsBaseUrl)
        if (cachedRootLayer) {
            return findLayerAndParentLayers(selectedLayerName, [cachedRootLayer], [cachedRootLayer])
        }

        abortController = new AbortController()
        const { signal } = abortController
        const response = await axios.get(wmsBaseUrl, { signal })
        const capabilitiesText = response.data

        const parser = new WMSCapabilities()
        const capabilities = parser.read(capabilitiesText)

        mapStore.cachePreviewRootLayer(wmsBaseUrl, capabilities.Capability.Layer)

        return findLayerAndParentLayers(
            selectedLayerName,
            [capabilities.Capability.Layer],
            [capabilities.Capability.Layer]
        )
    }

    function getBoundingBoxExtent(
        layer: CapabilitiesLayer,
        parents: CapabilitiesLayer[]
    ): [number, number, number, number] | null {
        const bbox = layer.BoundingBox?.find((b: BoundingBox) => b.crs === EPSG_2056)
        if (bbox?.extent) {
            return bbox.extent
        } else if (layer.EX_GeographicBoundingBox) {
            const [minLon, minLat, maxLon, maxLat] = layer.EX_GeographicBoundingBox
            const proj4 = getConfiguredProj4()
            const transformedMin = proj4(EPSG_4326, EPSG_2056, [minLon, minLat])
            const transformedMax = proj4(EPSG_4326, EPSG_2056, [maxLon, maxLat])
            return [transformedMin[0], transformedMin[1], transformedMax[0], transformedMax[1]]
        }
        if (parents.length > 0) {
            return getBoundingBoxExtent(parents[0], parents.slice(1))
        }
        return null
    }

    function findLayerAndParentLayers(
        layerId: string,
        startFrom: CapabilitiesLayer[] | undefined,
        parents: CapabilitiesLayer[]
    ): { layer?: CapabilitiesLayer; parents: CapabilitiesLayer[] } {
        let found: { layer?: CapabilitiesLayer; parents: CapabilitiesLayer[] } = { parents: [] }
        const layers = startFrom
        if (!layers || layers.length === 0) {
            return found
        }
        for (let i = 0; i < layers?.length && !found.layer; i++) {
            if (layers[i]?.Name === layerId || layers[i]?.Title === layerId) {
                found.layer = layers[i]
                found.parents = parents
            } else if (layers[i]?.Layer?.length && layers[i].Layer!.length > 0) {
                found = findLayerAndParentLayers(layerId, layers[i]?.Layer, [layers[i], ...parents])
            }
        }
        return found
    }

    function resetErrorState(): void {
        hasPreviewError.value = false
    }

    async function getGeocatalogLayerInformation(
        layerId: string,
        lang: string
    ): Promise<GeocatLayerInformation | null> {
        const response = await fetchGeocatalogLayer(layerId, lang)
        if (!response || response?.layers?.length < 1) {
            return null
        }
        const layer = response.layers[0]
        return {
            href: layer.attributes.wmsUrlResource,
            name: layer.layerBodId,
            id: layer.idGeoCat,
        }
    }

    return {
        isPreviewLoading,
        previewMap,
        hasPreviewError,
        initializeMap,
        addLayerExtentToMap,
        extractLayerExtent,
        getExtentCoordinates,
        getGeocatalogLayerInformation,
        addBackgroundLayer,
        createWMSLayer,
        addLayer,
        resetMap,
        resetErrorState,
    }
}
