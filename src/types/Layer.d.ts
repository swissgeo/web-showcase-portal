// TODO define somethign that encapsulates the results from GeoNetwork
// but also the addresses
// which can then be used as the layers on the map I guess...

import type { GeonetworkRecord } from '@/types/gnRecord'

export type Layer = {
    id: string
    name: string
    geonetworkRecord: null | GeonetworkRecord
}
