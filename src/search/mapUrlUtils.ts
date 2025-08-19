import type { Geometry } from 'geojson'

import type { Layer } from '@/types/layer'
import type { MapUrlParameter } from '@/types/mapUrlParameters'

import { isCrosshair, type Crosshair } from '@/types/crosshair'
import { isLanguageSupported, type Language } from '@/types/language'
import { transformRecordIntoGeoadminLayerParam } from '@/utils/layerUtils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validOrigins = [
    'zipcode',
    'gg25',
    'district',
    'kantone',
    'gazetteer',
    'address',
    'parcel',
] as const
type OriginType = (typeof validOrigins)[number]

// These are all possible origins 'address', 'zipcode', 'district', 'kantone', 'gazetteer', 'address', 'parcel'
export const LOCATION_SEARCH_ORIGINS: OriginType[] = [
    'address',
    'zipcode',
    'district',
    'kantone',
    'gazetteer',
    'address',
]
// Resolutions for each LV95 zoom level, from 0 to 14 (from geoadmin web-mapviewer)
export const LV95_RESOLUTIONS = [
    650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.0, 0.5, 0.25, 0.1,
] as const
export const PARCEL_SEARCH_ORIGINS: OriginType[] = ['parcel']

export const TRANSPARENCY_DEBOUNCE_DELAY = 500
export const ZOOM_DEBOUNCE_DELAY = 200
export function generateMapUrlParameters(params: Partial<MapUrlParameter>) {
    const searchParams = new URLSearchParams()
    // if the layers parameter is not provided, the layers will not get updated / removed
    searchParams.append('layers', params.layers ?? '')

    if (params.lang) {
        searchParams.append('lang', params.lang)
    }

    if (params.bgLayer) {
        searchParams.append('bgLayer', params.bgLayer)
    }

    if (params.crosshair && params.crossHairPosition) {
        searchParams.append('crosshair', [params.crosshair, ...params.crossHairPosition].join(','))
    }

    if (params.z !== undefined) {
        searchParams.append('z', String(params.z))
    }

    if (params.center?.length === 2) {
        searchParams.append('center', params.center.join(','))
    }

    if (params.geolocation) {
        searchParams.append('geolocation', 'true')
    }

    searchParams.append('hideEmbedUI', 'true')

    return searchParams
}

export const convertToMapParameter = (layer: Layer) => {
    if (!layer.geonetworkRecord) {
        // From catalog
        return `${layer.id},${layer.visible ? 't' : 'f'},${layer.opacity}`
    }
    return `${transformRecordIntoGeoadminLayerParam(layer.geonetworkRecord)},${layer.visible ? 't' : 'f'},${layer.opacity}`
}

export function getFirstCoordinate(geometry: Geometry): [number, number] | undefined {
    switch (geometry.type) {
        case 'Point':
            return geometry.coordinates as [number, number]

        case 'LineString':
        case 'MultiPoint':
            return geometry.coordinates[0] as [number, number]

        case 'Polygon':
        case 'MultiLineString':
            return geometry.coordinates[0][0] as [number, number]

        case 'MultiPolygon':
            return geometry.coordinates[0][0][0] as [number, number]

        default:
            // Handle unexpected types (GeometryCollection, etc.)
            // eslint-disable-next-line no-console
            console.debug(`Unsupported geometry type: ${geometry.type}`)
            return undefined
    }
}

export function getUrlParamsFromSource(
    embedUrlParams: string,
    currentStoreParams: Partial<MapUrlParameter>
) {
    const params = new URLSearchParams(embedUrlParams)
    const paramsToPush = {} as Partial<MapUrlParameter>

    // typescript will yell at us if we don't ensure each value is of the correct type :)

    params.forEach((value, key) => {
        if (key === 'z') {
            paramsToPush[key] = parseFloat(value as string)
        } else if (key === 'center' || key === 'crossHairPosition') {
            const coordinates: string[] = value.split(',') as string[]
            paramsToPush[key] = [parseFloat(coordinates[0]), parseFloat(coordinates[1])]
        } else if (key === 'hideEmbedUI') {
            paramsToPush[key] = true
        } else if (key === 'geolocation') {
            // if the geolocation is set without a value, it means it is enabled
            // if the value is 'false', it means it is disabled
            const isGeolocationDisabled = value === 'false'
            paramsToPush[key] = !isGeolocationDisabled
        } else if (key === 'lang') {
            if (isLanguageSupported(value as string)) {
                paramsToPush[key] = value as Language
            }
        } else if (key === 'crosshair') {
            if (isCrosshair(value as string)) {
                paramsToPush[key] = value as Crosshair
            }
        } else if (key === 'layers' || key === 'bgLayer') {
            paramsToPush[key] = value as string
        } else if (key === 'topic') {
            paramsToPush[key] = value as string
        }
    })
    return { ...currentStoreParams, ...paramsToPush }
}
/**
 *
 * @param increaseZoomLevel a boolean which specify if we should zoom in or out
 * @param currentZoomLevel the current zoom level
 * @returns {number} the next rounded zoom level in the wanted direction.
 */
export function changeZoomLevel(shouldZoomIn: boolean, currentZoomLevel: number): number {
    if (currentZoomLevel) {
        return shouldZoomIn
            ? Math.min(Math.floor(currentZoomLevel + 1), 13)
            : Math.max(Math.ceil(currentZoomLevel - 1), 0)
    }
    return 1
}

/**
 * Get zoom level from resolution
 * @param resolution the resolution in meters per pixel
 * @returns the zoom level corresponding to the resolution
 */
function getZoomLevelFromResolution(resolution: number): number {
    const matchingResolution = LV95_RESOLUTIONS.find(
        (lv95Resolution) => lv95Resolution <= resolution
    )
    if (matchingResolution) {
        return LV95_RESOLUTIONS.indexOf(matchingResolution)
    }

    // if no match was found, we have to decide if the resolution is too great,
    // or too small to be matched and return the zoom accordingly
    const smallestResolution = LV95_RESOLUTIONS.slice(-1)[0]
    if (smallestResolution > resolution) {
        // if the resolution was smaller than the smallest available, we return the zoom level corresponding
        // to the smallest available resolution
        return LV95_RESOLUTIONS.indexOf(smallestResolution)
    }
    // otherwise, we return the zoom level corresponding to the greatest resolution available
    return 0
}

/**
 * Calculate zoom level and center from an extent (bounding box) and update the map store
 * @param extent The bounding box as [minX, minY, maxX, maxY] in EPSG:2056 coordinates
 * @param mapStore The map store to update
 */
export function zoomToExtent(
    extent: [number, number, number, number],
    setMapUrlSearchParams: (params: Partial<MapUrlParameter>, updateMap?: boolean) => void
): void {
    const [minX, minY, maxX, maxY] = extent
    const center: [number, number] = [(minX + maxX) / 2, (minY + maxY) / 2]
    const extentWidth = maxX - minX
    const extentHeight = maxY - minY

    // Use window.innerWidth/Height directly for consistency
    const resolutionX = extentWidth / window.innerWidth
    const resolutionY = extentHeight / window.innerHeight
    const targetResolution = Math.max(resolutionX, resolutionY)

    const zoomLevel = getZoomLevelFromResolution(targetResolution)
    // Zoom levels are fixed value with LV95, the one calculated is the fixed zoom the closest to the floating
    // zoom level required to show the full extent on the map (scale to fill).
    // So the view will be too zoomed-in to have an overview of the extent.
    // We then set the zoom level to the one calculated minus one (expect when the calculated zoom is 0...).
    const finalZoom = Math.max(zoomLevel - 1, 0) // Ensure zoom level is at least 0

    // Update the map store
    setMapUrlSearchParams({
        center,
        z: finalZoom,
    })
}

export function getResolutionForZoom(zoom: number): number {
    const index = Math.max(0, Math.min(Math.floor(zoom), LV95_RESOLUTIONS.length - 1))
    return LV95_RESOLUTIONS[index]
}

export function getVisibleExtent(
    center: [number, number],
    zoom: number,
    viewportWidth: number,
    viewportHeight: number
): [[number, number], [number, number]] {
    const resolution = getResolutionForZoom(zoom)
    const widthInMeters = viewportWidth * resolution
    const heightInMeters = viewportHeight * resolution

    const minX = center[0] - widthInMeters / 2
    const maxX = center[0] + widthInMeters / 2
    const minY = center[1] - heightInMeters / 2
    const maxY = center[1] + heightInMeters / 2

    return [
        [minX, minY],
        [maxX, maxY],
    ]
}
