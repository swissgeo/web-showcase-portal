import { ref, computed } from 'vue'

import { fetchTopicCatalogJson, fetchLayerConfigJson } from '@/api/topics.api'
import { useGeocatalogStore } from '@/store/geocatalog'
import { useMainStore, type LayerConfig } from '@/store/main'
import { type TopicTreeNode } from '@/types/geocatalog'
import { LayerType } from '@/types/layer'

// This topicTreeRoot ref is outside of the composable function to have one single source of truth
const topicTreeRoot = ref<TopicTreeNode | null>(null)

export function useTopicTree() {
    const geocatalogStore = useGeocatalogStore()
    const mainStore = useMainStore()
    const topic = computed(() => geocatalogStore.currentTopic || 'ech')

    // Filter the root node to only include layers that are present in the layer configs
    function filterTree(
        node: TopicTreeNode,
        layerConfigs: Record<string, LayerConfig | null>
    ): TopicTreeNode | null {
        if (node.category === 'layer') {
            if (!layerConfigs || !(node.layerBodId in layerConfigs)) {
                return null
            }
        }
        const children = node.children
            ?.map((child) => filterTree(child, layerConfigs))
            .filter(Boolean) as TopicTreeNode[] | undefined
        return { ...node, children }
    }

    // This function fetches the topic tree root and layer configs for the given topic and language if not already cached.
    // It ensures that only layers present in the configs are included in the tree, then updates the store and local ref.
    async function fetchAndPrepareTopicTreeRoot(topic: string, lang: string) {
        let root = geocatalogStore.getTopicTreeRoot(topic, lang)
        if (!root) {
            const data = await fetchTopicCatalogJson(topic, lang)
            root = (data as { results?: { root?: TopicTreeNode } })?.results?.root || null
            let layerConfigs = mainStore.getLayerConfigsByLang(lang)
            if (!layerConfigs) {
                const layerConfigsData = await fetchLayerConfigJson(lang)
                // Parse the layer configs and set them in the main store
                mainStore.setLayerConfigs(lang, layerConfigsData as Record<string, LayerConfig>)
                layerConfigs = mainStore.getLayerConfigsByLang(lang)
            }
            if (root) {
                root = filterTree(root, layerConfigs)
            }
            geocatalogStore.setTopicTreeRoot(topic, lang, root)
        }
        topicTreeRoot.value = root
    }

    async function updateGeocatalogLanguage() {
        // We have to fetch the topic tree root again for the new language so we await for it before we can use it
        await fetchAndPrepareTopicTreeRoot(topic.value, mainStore.language)
        updateLayersLanguageChange()
    }

    function updateLayersLanguageChange() {
        const layers = mainStore.layersOnMap
        const geocatalogLayers = layers.filter((layer) => layer.type === LayerType.Geocatalog)
        geocatalogLayers.forEach((layer) => {
            const layerConfigLang = mainStore.getLayerConfigsByLang(mainStore.language)
            if (!layerConfigLang) {
                return
            }
            const layerConfig = layerConfigLang[layer.id]

            if (!layerConfig) {
                return
            }
            mainStore.replaceLayerOnMap({
                id: layerConfig.id || layer.id,
                name: layerConfig.label,
                opacity: 1,
                visible: true,
                geonetworkRecord: null,
                type: LayerType.Geocatalog,
            })
        })
    }

    return {
        topicTreeRoot,
        fetchAndPrepareTopicTreeRoot,
        updateGeocatalogLanguage,
    }
}
