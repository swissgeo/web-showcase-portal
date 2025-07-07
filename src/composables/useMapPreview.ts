import type BaseLayer from 'ol/layer/Base'

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

import type { CapabilitiesLayer, BoundingBox, LayerInformation } from '@/types/mapPreview'

const SWISS_EXTENT = [2420000, 1030000, 2900000, 1350000]
const MIN_EXTENT_SIZE = 30000

const previewMap = ref<Map | null>(null)

const hasPreviewError: Ref<boolean> = ref(false)
const isPreviewLoading: Ref<boolean> = ref(false)

// Used for async cancellation (must be shared with component)
let latestRequestId = 0

export function useMapPreview() {
    function registerProjection() {
        proj4.defs(
            'EPSG:2056',
            '+proj=somerc +lat_0=46.9524055555556 +lon_0=7.43958333333333 +k=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs'
        )
        registerProj(proj4)
        if (!getProjection('EPSG:2056')) {
            // eslint-disable-next-line no-console
            console.error('EPSG:2056 projection not registered!')
            hasPreviewError.value = true
        }
    }

    function createBackgroundLayer(bgLayerName: string): TileLayer | undefined {
        const bgLayerUrl = `https://sys-wmts.dev.bgdi.ch/1.0.0/${bgLayerName}/default/current/2056/{TileMatrix}/{TileCol}/{TileRow}.jpeg`

        const bgLayerOptions = {
            layer: bgLayerName,
            url: bgLayerUrl,
            format: 'jpeg',
            matrixSet: 'EPSG:2056',
            projection: 'EPSG:2056',
            requestEncoding: 'REST' as RequestEncoding,
            cacheSize: 0,
            tileGrid: new WMTSTileGrid({
                origin: [2420000, 1350000],
                resolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750],
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

        tileLayer.getSource()?.on('tileloaderror', () => {
            // eslint-disable-next-line no-console
            console.error('Tile load error on WMTS background layer:', bgLayerName)
            hasPreviewError.value = true
        })

        return tileLayer
    }

    async function initializeMap() {
        try {
            registerProjection()

            previewMap.value = new Map({
                layers: [], // Initialize with no layers
                view: new View({
                    projection: 'EPSG:2056',
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
        previewMap.value.getLayers().clear()
        if (backgroundLayer) {
            previewMap.value.addLayer(backgroundLayer)
        }
    }

    function addLayerExtentToMap(extent: [number, number, number, number]): void {
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
                projection: 'EPSG:2056',
                serverType: 'geoserver',
            }),
        })
        // Listen for image load errors
        layer.getSource()?.on('imageloaderror', () => {
            // eslint-disable-next-line no-console
            console.error('Image load error on WMS layer:', selectedLayerName)
        })

        return layer
    }

    /**
     * Async function with requestId cancellation.
     */
    async function extractLayerInformation(
        wmsBaseUrl: string,
        selectedLayerName: string,
        requestId?: number // Pass from component for cancellation
    ): Promise<LayerInformation> {
        const result: LayerInformation = {
            abstract: null,
            title: null,
            extent: null,
        }
        try {
            isPreviewLoading.value = true
            latestRequestId = requestId ?? latestRequestId

            // Fetch the capabilities XML from the WMS server
            const response = await fetch(wmsBaseUrl)
            // Check for cancellation
            if (requestId !== undefined && requestId !== latestRequestId) return result

            const capabilitiesText = await response.text()
            if (requestId !== undefined && requestId !== latestRequestId) return result

            // Parse the capabilities using the WMSCapabilities parser
            const parser = new WMSCapabilities()
            const capabilities = parser.read(capabilitiesText)
            if (requestId !== undefined && requestId !== latestRequestId) return result

            // Find the layer information from the capabilities
            const layers = capabilities.Capability?.Layer?.Layer
            const selectedLayer = layers?.find(
                (layer: CapabilitiesLayer) => layer.Name === selectedLayerName
            )
            if (!selectedLayer) {
                // eslint-disable-next-line no-console
                console.error(`Layer with name "${selectedLayerName}" not found in capabilities`)
                hasPreviewError.value = true
                isPreviewLoading.value = false
                return result
            }
            result.abstract = selectedLayer?.Abstract || null
            result.title = selectedLayer?.Title || null

            const boundingBox = selectedLayer.BoundingBox?.find(
                (bbox: BoundingBox) => bbox.crs === 'EPSG:2056'
            )

            if (!boundingBox) {
                // eslint-disable-next-line no-console
                console.error(
                    `Bounding box with EPSG:2056 not found for layer "${selectedLayerName}"`
                )
                hasPreviewError.value = true
                isPreviewLoading.value = false
                return result
            }

            const extent: [number, number, number, number] = boundingBox.extent
            result.extent = extent
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to extract extent:', error)
            hasPreviewError.value = true
            isPreviewLoading.value = false
            return result
        }
        hasPreviewError.value = false
        isPreviewLoading.value = false
        return result
    }

    function resetErrorState(): void {
        hasPreviewError.value = false
    }

    return {
        isPreviewLoading,
        previewMap,
        hasPreviewError,
        initializeMap,
        addLayerExtentToMap,
        extractLayerInformation,
        addBackgroundLayer,
        createWMSLayer,
        addLayer,
        resetMap,
        resetErrorState,
    }
}
