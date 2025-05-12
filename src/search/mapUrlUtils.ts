import type { Geometry } from 'geojson'

import type { Layer } from '@/types/Layer'
import type { MapUrlParameter } from '@/types/mapUrlParameters'

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

    if (params.crosshair) {
        searchParams.append('crosshair', params.crosshair)
    }

    if (params.z !== undefined) {
        searchParams.append('z', String(params.z))
    }

    if (params.center?.length === 2) {
        searchParams.append('center', params.center.join(','))
    }

    return searchParams
}

export const convertToMapParameter = (layer: Layer) => {
    if (!layer.geonetworkRecord) {
        return
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
