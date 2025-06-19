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
    'parcel',
]

export const TRANSPARENCY_DEBOUNCE_DELAY = 500

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
