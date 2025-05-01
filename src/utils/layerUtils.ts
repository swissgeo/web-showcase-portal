import type { GeonetworkRecord } from '@/types/gnRecord'

export const getServiceWMSResource = (record: GeonetworkRecord) => {
    const onlineresources = record.onlineResources
    for (const res of onlineresources) {
        if (
            res.type === 'service' &&
            res.accessServiceProtocol &&
            ['wms', 'wmts'].includes(res.accessServiceProtocol)
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
    const wmsResource = getServiceWMSResource(record)
    if (!wmsResource) {
        return false
    }

    // so far we can only add those that have a WMS url and a layer name
    return !!wmsResource?.name && !!wmsResource?.url
}

export const getWMSResourceData = (record: GeonetworkRecord) => {
    const wmsResource = getServiceWMSResource(record)
    if (!wmsResource) {
        throw new Error("Can't find the WMS data")
    }

    if (!isAddableToMap(record)) {
        throw new Error("Can't add this layer to the map")
    }

    return {
        url: wmsResource.url.origin,
        name: wmsResource.name,
    }
}
