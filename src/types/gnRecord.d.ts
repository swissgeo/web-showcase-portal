export type GeonetworkRecord = {
    kind: 'dataset'
    status: string | null
    lineage: string | null
    recordUpdated: string | null
    recordPublished: string | null
    ownerOrganization: string | null
    licenses: any[] // You can replace `any` with a more specific type if known
    legalConstraints: any[]
    securityConstraints: any[]
    otherConstraints: any[]
    contacts: any[]
    contactsForResource: any[]
    keywords: any[]
    topics: any[]
    spatialExtents: any[]
    temporalExtents: any[]
    overviews: any[]
    defaultLanguage: string | null
    otherLanguages: string[]
    title: string
    onlineResources: {
        name?: string
        description?: string
        type: 'link' | 'service' | 'download'
        url: string
        accessServiceProtocol?: 'wms' | 'wmts' | 'wfs' | string
        accessRestricted?: boolean
    }[]
    extras: {
        id: string
        edit: boolean
        isPublishedToAll: boolean
    }
    uniqueIdentifier: string
    landingPage: string
}
