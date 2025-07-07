import type { GeonetworkRecord, OnlineResource, OnlineResourceType } from '@/types/gnRecord'

export const getResources = (type: OnlineResourceType, record: GeonetworkRecord) => {
    const onlineResources = record.onlineResources

    return onlineResources.filter((resource) => resource.type === type)
}

export const getLicense = (record: GeonetworkRecord) => {
    if (record.licenses.length) {
        const license = record.licenses[0]
        if (license.url) {
            return license.url
        }
    }
    return null
}

export const getLegalConstraint = (record: GeonetworkRecord) => {
    if (record.legalConstraints.length) {
        const constraint = record.legalConstraints[0]
        if (constraint.url) {
            return constraint.url
        }
    }
    return null
}

export const getServiceResource = (type: 'wms' | 'wmts', record: GeonetworkRecord) => {
    const services = getResources('service', record)
    for (const res of services) {
        if (res.accessServiceProtocol && [type as string].includes(res.accessServiceProtocol)) {
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

export const transformRecordIntoGetCapabilitiesUrl = (
    record: GeonetworkRecord
): OnlineResource | null => {
    const wmsResource = getServiceResource('wms', record)
    const wmtsResource = getServiceResource('wmts', record)
    if (!wmsResource && !wmtsResource) {
        throw new Error("Can't find the WM(T)S data")
    }

    if (!isAddableToMap(record)) {
        throw new Error("Can't add this layer to the map")
    }

    if (wmsResource) {
        return wmsResource
    }
    if (wmtsResource) {
        return wmtsResource
    }
    return null
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
        return `WMS|${wmsResource.url.origin}${wmsResource.url.pathname}|${wmsResource.name}`
    }
    if (wmtsResource) {
        return `WMTS|${wmtsResource.url.origin}${wmtsResource.url.pathname}|${wmtsResource.name}`
    }
    return null
}
