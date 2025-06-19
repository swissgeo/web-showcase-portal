import axios from 'axios'


// For now, we use the dev API, but this should be configurable in the future
export const API3_BASE_URL = 'https://sys-api3.dev.bgdi.ch'

export async function fetchTopicCatalogJson(topic: string, lang: string): Promise<unknown> {
    const url = `${API3_BASE_URL}/rest/services/${topic}/CatalogServer?lang=${lang}`
    const response = await axios.get(url)
    return response.data
}

export async function fetchLayerConfigJson(lang: string): Promise<unknown> {
    const url = `${API3_BASE_URL}/rest/services/all/MapServer/layersConfig?lang=${lang}`
    const response = await axios.get(url)
    return response.data
}

export async function fetchGeocatalogLayerDescription(
    layerId: string,
    lang: string,
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
