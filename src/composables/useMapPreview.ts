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
import { register as registerProj } from 'ol/proj/proj4'
import ImageWMS from 'ol/source/ImageWMS'
import VectorSource from 'ol/source/Vector'
import WMTS, { type RequestEncoding } from 'ol/source/WMTS'
import Stroke from 'ol/style/Stroke'
import Style from 'ol/style/Style'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import View from 'ol/View'
import proj4 from 'proj4'
import { ref, type Ref } from 'vue'

import type { BoundingBox, CapabilitiesLayer, GeocatLayerInformation } from '@/types/mapPreview'

import { fetchGeocatalogLayer } from '@/api/topics.api'
import { useMapStore } from '@/store/map'

const SWISS_EXTENT = [2420000, 1050000, 2850000, 1350000]
const MIN_EXTENT_SIZE = 30000
const SWISS_TILE_RESOLUTIONS = [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750]
const EPSG_2056_PROJ_STRING =
    '+proj=somerc +lat_0=46.9524055555556 +lon_0=7.43958333333333 +k=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs'
const EPSG_2056 = 'EPSG:2056'

export const LONG_PRESS_TIMEOUT_MS = 500

const previewMap = ref<Map | null>(null)

// Used for async cancellation (must be shared with component)
let abortController: AbortController | null = null

export function useMapPreview() {
    const mapStore = useMapStore()
    const hasPreviewError: Ref<boolean> = ref(false)
    const isPreviewLoading: Ref<boolean> = ref(false)

    function registerProjection() {
        proj4.defs(EPSG_2056, EPSG_2056_PROJ_STRING)
        registerProj(proj4)
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

    async function addLayerExtentToMap(
        wmsBaseUrl: string,
        selectedLayerName: string
    ): Promise<void> {
        const extent = await extractLayerExtent(wmsBaseUrl, selectedLayerName)

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

    function createWMSLayer(wmsBaseUrl: string, selectedLayerName: string): ImageLayer<ImageWMS> {
        const layer = new ImageLayer({
            source: new ImageWMS({
                url: wmsBaseUrl,
                params: { LAYERS: selectedLayerName },
                ratio: 1,
                projection: EPSG_2056,
                serverType: 'geoserver',
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

    /**
     * Async function with requestId cancellation.
     */
    async function extractLayerExtent(
        wmsBaseUrl: string,
        selectedLayerName: string
    ): Promise<[number, number, number, number] | null> {
        let result = null
        try {
            isPreviewLoading.value = true
            cancelOngoingRequest()

            const selectedLayer = await getSelectedLayer(wmsBaseUrl, selectedLayerName)

            if (!selectedLayer) {
                // eslint-disable-next-line no-console
                console.error(`Layer with name "${selectedLayerName}" not found in capabilities`)
                return result
            }

            const extent = getBoundingBoxExtent(selectedLayer)

            if (!extent) {
                // eslint-disable-next-line no-console
                console.error(
                    `Bounding box with ${EPSG_2056} not found for layer "${selectedLayerName}"`
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
    ): Promise<CapabilitiesLayer | undefined> {
        const cachedLayers = mapStore.getCachedPreviewLayers(wmsBaseUrl)

        if (cachedLayers?.length) {
            return cachedLayers.find((l) => l.Name === selectedLayerName)
        }

        abortController = new AbortController()
        const { signal } = abortController
        const response = await axios.get(wmsBaseUrl, { signal })
        const capabilitiesText = response.data

        const parser = new WMSCapabilities()
        const capabilities = parser.read(capabilitiesText)

        const layers = capabilities.Capability.Layer.Layer
        mapStore.cachePreviewLayers(wmsBaseUrl, layers)

        return layers.find((l: CapabilitiesLayer) => l.Name === selectedLayerName)
    }

    function getBoundingBoxExtent(
        layer: CapabilitiesLayer
    ): [number, number, number, number] | null {
        const bbox = layer.BoundingBox?.find((b: BoundingBox) => b.crs === EPSG_2056)
        return bbox?.extent || null
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
