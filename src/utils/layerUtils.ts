import type { GeonetworkRecord } from '@/types/gnRecord'

export const getServiceResource = (type: 'wms' | 'wmts', record: GeonetworkRecord) => {
    const onlineresources = record.onlineResources
    for (const res of onlineresources) {
        if (
            res.type === 'service' &&
            res.accessServiceProtocol &&
            [type as string].includes(res.accessServiceProtocol)
        ) {
            return res
        }
    }
    return null
}

/**
 * Rudimentary check if it's addable to the map
 * This is subject to change
 * @param record
 * @returns
 */
export const isAddableToMap = (record: GeonetworkRecord) => {
    const wmsResource = getServiceResource('wms', record)
    const wmtsResource = getServiceResource('wmts', record)
    if (!wmsResource && !wmtsResource) {
        return false
    }

    // so far, we can only add those that have a WM(T)S url and a layer name
    if (wmsResource) {
        return !!wmsResource?.name && !!wmsResource?.url
    }
    return !!wmtsResource?.name && !!wmtsResource?.url
}

export const transformRecordIntoGeoadminLayerParam = (record: GeonetworkRecord) => {
    const wmsResource = getServiceResource('wms', record)
    const wmtsResource = getServiceResource('wmts', record)
    if (!wmsResource && !wmtsResource) {
        throw new Error("Can't find the WM(T)S data")
    }

    if (!isAddableToMap(record)) {
        throw new Error("Can't add this layer to the map")
    }

    if (wmsResource) {
        return `WMS|${wmsResource.url.origin}|${wmsResource.name}`
    }
    if (wmtsResource) {
        return `WMTS|${wmtsResource.url.origin}|${wmtsResource.name}`
    }
    return null
}
