import axios from 'axios'

// For now, we use the dev API, but this should be configurable in the future
export async function fetchTopicCatalogJson(topic: string, lang: string): Promise<unknown> {
    const url = `https://sys-api3.dev.bgdi.ch/rest/services/${topic}/CatalogServer?lang=${lang}`
    const response = await axios.get(url)
    return response.data
}

// For now, we use the dev API, but this should be configurable in the future
export async function fetchLayerConfigJson(lang: string): Promise<unknown> {
    const url = `https://sys-api3.dev.bgdi.ch/rest/services/all/MapServer/layersConfig?lang=${lang}`
    const response = await axios.get(url)
    return response.data
}
