import { ref, watchEffect, computed } from 'vue'

import { fetchTopicCatalogJson, fetchLayerConfigJson } from '@/api/topics.api'
import { useGeocatalogStore } from '@/store/geocatalog'
import { useMainStore, type LayerConfig } from '@/store/main'
import { type TopicTreeNode } from '@/types/geocatalog'

export function useTopicTree() {
    const geocatalogStore = useGeocatalogStore()
    const mainStore = useMainStore()

    const topicTreeRoot = ref<TopicTreeNode | null>(null)

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

    // Initialize topic tree data with reactive updates
    function initializeTopicTree() {
        const topic = computed(() => geocatalogStore.currentTopic || 'ech')

        watchEffect(() => {
            fetchAndPrepareTopicTreeRoot(topic.value, mainStore.language)
        })
    }

    return {
        topicTreeRoot,
        fetchAndPrepareTopicTreeRoot,
        initializeTopicTree,
    }
}
