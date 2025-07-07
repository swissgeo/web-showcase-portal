import axios from 'axios'

import type { GeocatalogTopic } from '@/types/geocatalog'
import type { GeocatLayerData } from '@/types/mapPreview'

// For now, we use the dev API, but this should be configurable in the future
export const API3_BASE_URL = 'https://sys-api3.dev.bgdi.ch'

export async function fetchTopicCatalogJson(topic: string, lang: string): Promise<unknown> {
    const url = `${API3_BASE_URL}/rest/services/${topic}/CatalogServer?lang=${lang}`
    try {
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error fetching topic catalog for ${topic} (${lang}):`, error)
        return null
    }
}

export async function fetchLayerConfigJson(lang: string): Promise<unknown> {
    const url = `${API3_BASE_URL}/rest/services/all/MapServer/layersConfig?lang=${lang}`
    try {
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error fetching layer config for language ${lang}:`, error)
        return null
    }
}

export async function fetchGeocatalogLayerDescription(
    layerId: string,
    lang: string
): Promise<string | null> {
    const url = `${API3_BASE_URL}/rest/services/all/MapServer/${layerId}/legend?lang=${lang}`
    try {
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error fetching layer info HTML for layer ${layerId}:`, error)
        return null
    }
}

export async function fetchGeocatalogLayer(
    layerId: string,
    lang: string
): Promise<GeocatLayerData | null> {
    const url = `https://api3.geo.admin.ch/rest/services/api/MapServer?searchText=${layerId}&lang=${lang}`
    try {
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error fetching layer for layer ${layerId}:`, error)
        return null
    }
}

export async function loadGeocatalogTopics(): Promise<GeocatalogTopic[]> {
    try {
        const response = await axios.get(`${API3_BASE_URL}/rest/services`)
        return response.data.topics as GeocatalogTopic[]
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Failed to load topics from backend`, error)
        return []
    }
}
