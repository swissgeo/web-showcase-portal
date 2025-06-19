// TODO define something that encapsulates the results from GeoNetwork
// but also the addresses
// which can then be used as the layers on the map I guess...

import type { GeonetworkRecord } from '@/types/gnRecord'

export enum LayerType {
    Geonetwork = 'Geonetwork',
    Geocatalog = 'Geocatalog',
}

export type Layer = {
    id: string
    name: string
    opacity: number
    visible: boolean
    geonetworkRecord: null | GeonetworkRecord
    type: LayerType
}
