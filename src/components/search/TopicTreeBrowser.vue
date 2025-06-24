<script lang="ts" setup>
import type { TreeNode } from 'primevue/treenode'

import Panel from 'primevue/panel'
import Select from 'primevue/select'
import Tree from 'primevue/tree'
import { computed, onMounted, ref, watch, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'

import { loadGeocatalogTopics } from '@/api/topics.api'
import { useGeocatalogStore } from '@/store/geocatalog'
import { useMainStore } from '@/store/main'
import { type GeocatalogTopic, type TopicTreeNode } from '@/types/geocatalog'
import { LayerType } from '@/types/layer'

const { t } = useI18n()

const mainStore = useMainStore()
const geocatalogStore = useGeocatalogStore()

const props = defineProps({
    root: {
        type: [Object, null] as PropType<TopicTreeNode | null>,
        required: true,
    },
})

const treeNodes = ref<TreeNode[]>([])

const selectedKeys = computed(() => {
    const layerIdsOnMap = mainStore.layersOnMap.map((l) => l.id)
    return collectSelectedKeys(treeNodes.value, layerIdsOnMap)
})

const expandedKeysObj = computed(() => {
    const obj: Record<string, boolean> = {}
    if (Array.isArray(geocatalogStore.expandedKeys)) {
        geocatalogStore.expandedKeys.forEach((key: string | number) => {
            obj[String(key)] = true
        })
    }
    return obj
})

const selectedTopic = computed<GeocatalogTopic | undefined>({
    get() {
        return geocatalogStore.topics.find((t) => t.id === geocatalogStore.currentTopic)
    },
    set(topic) {
        geocatalogStore.setCurrentTopic(topic?.id ?? '')
    },
})
const geocatalogTopics = computed(() => geocatalogStore.topics)

function collectSelectedKeys(
    nodes: TreeNode[],
    layerIdsOnMap: string[]
): Record<string, { checked: boolean; partialChecked: boolean }> {
    const selected: Record<string, { checked: boolean; partialChecked: boolean }> = {}
    function traverse(node: TreeNode) {
        const isNodeSelected =
            node.data && node.data.layerBodId && layerIdsOnMap.includes(node.data.layerBodId)
        if (isNodeSelected) {
            selected[node.key] = { checked: true, partialChecked: false }
        }
        node.children?.forEach(traverse)
    }
    nodes.forEach(traverse)
    return selected
}

function toPrimeTreeNodes(node: TopicTreeNode): TreeNode {
    const isLayer = node.category === 'layer'
    return {
        key: String(node.id),
        label: node.label || String(node.id),
        data: node,
        leaf: isLayer,
        children: node.children?.map(toPrimeTreeNodes),
        icon: isLayer ? 'pi pi-file' : 'pi pi-folder',
    }
}

function setTreeNodesFromRoot(root: TopicTreeNode | null) {
    if (!root) {
        return
    }

    if (root.children && root.children.length === 1) {
        treeNodes.value = [toPrimeTreeNodes(root.children[0])]
    } else if (root.children && root.children.length > 1) {
        treeNodes.value = root.children.map(toPrimeTreeNodes)
    } else {
        treeNodes.value = [toPrimeTreeNodes(root)]
    }
}

watch(
    () => props.root,
    (root) => {
        setTreeNodesFromRoot(root)
    },
    { immediate: true }
)

function onNodeSelect(node: TreeNode) {
    if (node.data.category === 'layer') {
        mainStore.addLayerToMap({
            id: node.data.layerBodId,
            name: node.data.label,
            opacity: 1,
            visible: true,
            geonetworkRecord: null,
            type: LayerType.Geocatalog,
        })
    }
}

function onNodeUnselect(node: TreeNode) {
    if (node.data.category === 'layer') {
        mainStore.deleteLayerById(node.data.layerBodId)
    }
}

function onExpand(node: TreeNode) {
    geocatalogStore.addExpandedKey(node.key)
}

function onCollapse(node: TreeNode) {
    geocatalogStore.removeExpandedKey(node.key)
}

function getTopicLabel(topicId: string): string {
    const translationKey = `geocatalog.topic.label.${topicId}`
    const label = t(translationKey)
    if (label === translationKey) {
        return topicId.toUpperCase()
    }
    return label
}

onMounted(async () => {
    if (geocatalogTopics.value.length === 0) {
        const topics = await loadGeocatalogTopics()
        geocatalogStore.setTopics(topics)
    }
})
</script>

<template>
    <Panel
        class="flex h-full flex-col"
        :header="t('geocatalog.title')"
    >
        <div class="mb-4 flex flex-row items-center gap-2">
            <label
                for="topic-select"
                class="mb-1 block font-medium"
                >{{ t('geocatalog.selectTopic') }}:</label
            >
            <Select
                id="topic-select"
                v-model="selectedTopic"
                :options="geocatalogTopics"
                :option-label="(topic) => getTopicLabel(topic.id)"
                class="w-full md:w-1/2"
                :pt="{
                    overlay: { 'data-cy': 'select-topic' },
                }"
            />
        </div>
        <div class="flex-1 overflow-hidden overflow-y-auto">
            <Tree
                :selection-keys="selectedKeys"
                :expanded-keys="expandedKeysObj"
                :value="treeNodes"
                :filter="true"
                :filter-placeholder="t('geocatalog.filter')"
                :expand-all="false"
                selection-mode="checkbox"
                :pt="{
                    pcNodeCheckbox: (options) => {
                        return options.context.node.data?.category !== 'layer'
                            ? { root: 'hidden' }
                            : {}
                    },
                }"
                @node-select="onNodeSelect"
                @node-unselect="onNodeUnselect"
                @node-expand="onExpand"
                @node-collapse="onCollapse"
            />
        </div>
    </Panel>
</template>
