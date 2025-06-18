import axios from 'axios'


export const API3_BASE_URL = 'https://sys-api3.dev.bgdi.ch'

// For now, we use the dev API, but this should be configurable in the future
export async function fetchTopicCatalogJson(topic: string, lang: string): Promise<unknown> {
    const url = `${API3_BASE_URL}/rest/services/${topic}/CatalogServer?lang=${lang}`
    const response = await axios.get(url)
    return response.data
}

// For now, we use the dev API, but this should be configurable in the future
export async function fetchLayerConfigJson(lang: string): Promise<unknown> {
    const url = `${API3_BASE_URL}/rest/services/all/MapServer/layersConfig?lang=${lang}`
    const response = await axios.get(url)
    return response.data
}
