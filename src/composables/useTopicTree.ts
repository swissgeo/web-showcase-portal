import { ref, computed } from 'vue'

import { fetchTopicCatalogJson, fetchLayerConfigJson } from '@/api/topics.api'
import { useGeocatalogStore } from '@/store/geocatalog'
import { useMainStore, type LayerConfig } from '@/store/main'
import { type GeocatalogTopic, type TopicTreeNode } from '@/types/geocatalog'
import { LayerType, type Layer } from '@/types/layer'

// This topicTreeRoot ref is outside of the composable function to have one single source of truth
const topicTreeRoot = ref<TopicTreeNode | null>(null)
const DEFAULT_VISIBILITY = true
const DEFAULT_OPACITY = 1

export function useTopicTree() {
    const geocatalogStore = useGeocatalogStore()
    const mainStore = useMainStore()
    const topic = computed(() => geocatalogStore.currentTopic?.id || 'ech')

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

    function activateLayersOfSelectedTopic() {
        const layers: Layer[] = []
        const layerConfigs = createLayerVisibilityOpacityMap(geocatalogStore.currentTopic)
        // Use plConfig layer IDs when available, otherwise fall back to selectedLayers since selectedLayers may not include all layers defined in plConfig
        const layerIds = geocatalogStore.currentTopic.plConfig
            ? Array.from(layerConfigs.keys())
            : geocatalogStore.currentTopic?.selectedLayers || []
        layerIds.forEach((layerId) => {
            const node = findNodeById(topicTreeRoot.value, layerId)
            const layerConfig = layerConfigs.get(layerId) || { visible: true, opacity: 1 }
            layers.push({
                id: layerId,
                name: node?.label ?? layerId,
                opacity: layerConfig?.opacity,
                visible: layerConfig?.visible,
                geonetworkRecord: null,
                type: LayerType.Geocatalog,
            })
        })
        mainStore.setBgLayerVisibility(geocatalogStore.currentTopic?.defaultBackground, true)
        // Reset the map layers to the new layers
        mainStore.setMapLayers(layers)
    }

    function createLayerVisibilityOpacityMap(
        currentTopic: GeocatalogTopic
    ): Map<string, { visible: boolean; opacity: number }> {
        const layerMap = new Map<string, { visible: boolean; opacity: number }>()

        if (!currentTopic.plConfig) {
            return layerMap
        }

        const params = new URLSearchParams(currentTopic.plConfig)
        const layers = params.get('layers')?.split(',') || []
        const opacities = params.get('layers_opacity')?.split(',').map(Number) || []
        const visibilities =
            params
                .get('layers_visibility')
                ?.split(',')
                .map((v) => v === 'true') || []
        layers.forEach((layerId, index) => {
            layerMap.set(layerId, {
                visible: visibilities[index] ?? DEFAULT_VISIBILITY, // Default to true if not found
                opacity: opacities[index] ?? DEFAULT_OPACITY, // Default to 1 if not found
            })
        })

        return layerMap
    }

    function findNodeById(node: TopicTreeNode | null, id: string): TopicTreeNode | null {
        if (!node) {
            return null
        }
        if (node.layerBodId === id) {
            return node
        }
        for (const child of node.children || []) {
            const found = findNodeById(child, id)
            if (found) return found
        }
        return null
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
                opacity: layer.opacity ?? DEFAULT_OPACITY,
                visible: layer.visible ?? DEFAULT_VISIBILITY,
                geonetworkRecord: null,
                type: LayerType.Geocatalog,
            })
        })
    }

    return {
        topicTreeRoot,
        fetchAndPrepareTopicTreeRoot,
        activateLayersOfSelectedTopic,
        updateGeocatalogLanguage,
    }
}
