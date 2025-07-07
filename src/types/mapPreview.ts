export interface BoundingBox {
    crs: string
    extent: [number, number, number, number]
}

export interface CapabilitiesLayer {
    Name: string
    Abstract?: string
    Title?: string
    BoundingBox?: BoundingBox[]
}

export interface LayerInformation {
    abstract: string | null
    title: string | null
    extent: [number, number, number, number] | null
    // hasError: boolean | null
}
