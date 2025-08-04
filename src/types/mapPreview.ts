export interface BoundingBox {
    crs: string
    extent: [number, number, number, number]
}

export interface CapabilitiesLayer {
    Name: string
    Abstract?: string
    Title?: string
    BoundingBox?: BoundingBox[]
    EX_GeographicBoundingBox?: [number, number, number, number]
    Layer?: CapabilitiesLayer[]
}

export interface GeocatLayerInformation {
    id: string
    href: string
    name: string
}
export interface GeocatLayerData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
    layers: {
        attributes: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [key: string]: any
            abstract: string
            wmsUrlResource: string
            wmsContactName: string
            urlDetails: string
            dataOwner: string
            dataStatus: string
        }
        name: string
        idGeoCat: string
        fullName: string
        layerBodId: string
    }[]
}
