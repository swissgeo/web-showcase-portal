import axios from 'axios'

export async function fetchTopicCatalogJson(topic: string, lang: string): Promise<unknown> {
    const url = `https://sys-api3.dev.bgdi.ch/rest/services/${topic}/CatalogServer?lang=${lang}`
    const response = await axios.get(url)
    return response.data
}
