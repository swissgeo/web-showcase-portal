// TODO define something that encapsulates the results from GeoNetwork
// but also the addresses
// which can then be used as the layers on the map I guess...

import type { GeonetworkRecord } from '@/types/gnRecord'

export enum LayerType {
    Geonetwork = 'Geonetwork',
    Geocatalog = 'Geocatalog',
}

export interface Layer {
    id: string
    name: string
    opacity: number
    visible: boolean
    geonetworkRecord: null | GeonetworkRecord
    type: LayerType
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // Allow additional properties for geocatalog layers
}
