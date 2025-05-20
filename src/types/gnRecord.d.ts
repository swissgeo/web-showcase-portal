/* eslint-disable @typescript-eslint/no-explicit-any */
export type GeonetworkRecord = {
    kind: 'dataset'
    status: string
    lineage: string | null
    recordUpdated: string
    recordPublished: string | null
    ownerOrganization: {
        logoUrl: string
        name: string
        recordCount: number
    }
    licenses: any[] // unclear from data
    legalConstraints: {
        text: string
        url?: URL
    }[]
    securityConstraints: any[]
    otherConstraints: any[]
    contacts: Contact[]
    contactsForResource: Contact[]
    keywords: Keyword[]
    topics: string[]
    spatialExtents: SpatialExtent[]
    temporalExtents: any[]
    overviews: {
        url: string
    }[]
    defaultLanguage: string
    otherLanguages: string[]
    updateFrequency: string
    title: string
    resourceCreated: string
    abstract: string
    extras: {
        isOpenData: boolean
        ownerInfo: string
        isPublishedToAll: boolean
        id: string
        favoriteCount: number
        catalogUuid: string
        edit: boolean
    }
    onlineResources: OnlineResource[]
    uniqueIdentifier: string
    landingPage: string
    recordCreated: string
}

type Contact = {
    lastName: string
    organization: {
        name: string
    }
    email: string
    role: string
    address: string
    phone: string
}

type Keyword = {
    label: string
    type: string
    key: string
    thesaurus: {
        id: string
        name: string
        url: string
    }
}

type SpatialExtent = {
    description: string
    geometry: {
        type: string
        coordinates: any // coordinates are marked "truncated", otherwise should be number[][][] for Polygon
    }
}

export type OnlineResource = {
    name: string
    description: string
    type: 'link' | 'download' | 'service'
    url: URL
    accessServiceProtocol?: string
    accessRestricted?: boolean
}
