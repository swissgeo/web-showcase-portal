<script lang="ts" setup>
import type { TreeNode } from 'primevue/treenode'

import Panel from 'primevue/panel'
import Popover from 'primevue/popover'
import Select from 'primevue/select'
import Tree from 'primevue/tree'
import { computed, onMounted, ref, watch, type PropType, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'

import type { GeocatLayerInformation } from '@/types/mapPreview'

import { loadGeocatalogTopics } from '@/api/topics.api'
import IconButton from '@/components/general/IconButton.vue'
import MapPreview from '@/components/search/MapPreview.vue'
import ShowLayerDetailButton from '@/components/search/ShowLayerDetailButton.vue'
import { LONG_PRESS_TIMEOUT_MS, useMapPreview } from '@/composables/useMapPreview'
import { defaultLayerOpacity } from '@/config/map.config'
import { useGeocatalogStore } from '@/store/geocatalog'
import { useMainStore } from '@/store/main'
import { SidebarType, useUiStore } from '@/store/ui'
import { type GeocatalogTopic, type TopicTreeNode } from '@/types/geocatalog'
import { LayerType } from '@/types/layer'

const { t } = useI18n()

const mainStore = useMainStore()
const geocatalogStore = useGeocatalogStore()
const uiStore = useUiStore()
const popoverComponent = ref()
const recordGetCapabilitiesUrl: Ref<GeocatLayerInformation | null> = ref(null)
const longPressTimeout = ref<NodeJS.Timeout | null>(null) // Timeout reference for long press
const targetRef = ref<EventTarget | null>(null)

const { initializeMap, resetMap, getGeocatalogLayerInformation } = useMapPreview()

const props = defineProps({
    root: {
        type: [Object, null] as PropType<TopicTreeNode | null>,
        required: true,
    },
    isDesktopView: {
        type: Boolean,
        default: true,
    },
})

const treeNodes = ref<TreeNode[]>([])

const isOnMap = (id: string) => mainStore.isLayerOnMap(id)
const layerToggleTitle = (on: boolean) =>
    on ? t('geocatalog.removeFromMap') : t('geocatalog.addToMap')

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
        return geocatalogStore.topics.find((t) => t.id === geocatalogStore.currentTopic?.id)
    },
    set(topic: GeocatalogTopic | undefined) {
        if (!topic) {
            return
        }
        geocatalogStore.setCurrentTopic(topic)
    },
})

const geocatalogTopics = computed(() => {
    const src = geocatalogStore.topics ?? []

    // cloning to avoid mutating the original array
    const sorted = [...src].sort((a, b) => getTopicLabel(a.id).localeCompare(getTopicLabel(b.id)))

    // Move the Geocatalog topic to the top
    const isGeoTopic = sorted.find((t) => t.id === 'ech')
    if (isGeoTopic) {
        sorted.splice(sorted.indexOf(isGeoTopic), 1)
        sorted.unshift(isGeoTopic)
    }

    return sorted
})

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
        icon: isLayer ? 'pi pi-map' : 'pi pi-folder',
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
        if (isOnMap(node.data.layerBodId)) {
            mainStore.deleteLayerById(node.data.layerBodId)
            return
        }
        mainStore.addLayerToMap({
            id: node.data.layerBodId,
            name: node.data.label,
            opacity: defaultLayerOpacity,
            visible: true,
            geonetworkRecord: null,
            type: LayerType.Geocatalog,
        })
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
    initializeMap()
    if (geocatalogTopics.value.length === 0) {
        const topics = await loadGeocatalogTopics()
        geocatalogStore.setTopics(topics)
    }
})

async function onNodeHover(node: TreeNode, event: MouseEvent) {
    if (node.data.category === 'layer' && props.isDesktopView) {
        popoverComponent.value.show(event)
        mainStore.setTempPreviewLayer({
            id: node.data.layerBodId,
            name: node.data.label,
            geonetworkRecord: null,
            opacity: 1,
            visible: true,
            type: LayerType.Geocatalog,
        })
        recordGetCapabilitiesUrl.value = await getGeocatalogLayerInformation(
            node.data.layerBodId,
            mainStore.language
        )
    }
}
function onNodeLeave(node: TreeNode) {
    popoverComponent.value.hide()
    resetMap()
    recordGetCapabilitiesUrl.value = null
    if (node.data.category === 'layer' && props.isDesktopView) {
        mainStore.resetTempPreviewLayer()
    }
}
const alignOverlay = () => {
    if (popoverComponent?.value) {
        popoverComponent.value.alignOverlay()
    }
}
// TODO DEV INFO: The Geocatalog is currently not available on mobile devices. Therefore this function was not tested on mobile.
// Function to handle long press on mobile
const handleTouchStart = async (node: TreeNode, event: TouchEvent) => {
    targetRef.value = event.currentTarget
    // Set a timeout to detect a long press (e.g., 500ms)
    longPressTimeout.value = setTimeout(async () => {
        recordGetCapabilitiesUrl.value = await getGeocatalogLayerInformation(
            node.data.layerBodId,
            mainStore.language
        )
        if (popoverComponent?.value) {
            // because of the delay we need an extra reference to the current target
            popoverComponent.value.show(event, targetRef.value)
        }
    }, LONG_PRESS_TIMEOUT_MS)
}

// Function to clear the timeout if the touch ends before the long press threshold
const handleTouchEnd = () => {
    if (longPressTimeout.value) {
        clearTimeout(longPressTimeout.value) // Clear the timeout
        longPressTimeout.value = null
    }
}
</script>

<template>
    <Panel
        class="flex h-full flex-col"
        :header="t('geocatalog.title')"
        :pt="{
            root: 'md:rounded-t-none md:shadow-none',
            header: 'md:justify-between justify-center',
            title: 'order-2 md:order-1 ',
            headerActions: 'absolute left-4 md:static md:order-2',
            content: 'px-2 py-4',
        }"
    >
        <template #icons>
            <IconButton
                v-if="!props.isDesktopView"
                severity="secondary"
                outlined
                class="order-1"
                icon="ChevronLeft"
                @click="uiStore.toggleSidebar(SidebarType.GEOCATALOG_TREE)"
            >
            </IconButton>
            <IconButton
                v-if="props.isDesktopView"
                severity="secondary"
                size="medium"
                :text="true"
                icon="PanelLeftClose"
                @click="uiStore.toggleSidebar(SidebarType.GEOCATALOG_TREE)"
            >
            </IconButton>
        </template>
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
                :pt="{
                    overlay: { 'data-cy': 'select-topic' },
                    root: 'w-full',
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
                :pt="{
                    node: { class: 'my-0' },
                    nodeContent: { class: 'py-0.5' },
                }"
                data-cy="geocatalog-tree"
                @node-expand="onExpand"
                @node-collapse="onCollapse"
            >
                <template #default="{ node }">
                    <div
                        :class="{
                            'border-t border-gray-200': node.data.category === 'layer',
                        }"
                    >
                        <!--  spacer div for top border -->
                        <div
                            v-if="node.data.category == 'layer'"
                            class="flex items-center gap-2 px-2 py-0.5"
                        ></div>
                        <div
                            class="flex"
                            :class="{
                                'w-70 justify-between px-2': node.data.category === 'layer',
                            }"
                            @mouseover="onNodeHover(node, $event)"
                            @mouseleave="onNodeLeave(node)"
                            @touchstart="handleTouchStart(node, $event)"
                            @touchend="handleTouchEnd"
                        >
                            <div
                                class="flex min-w-0 flex-1 items-center gap-2 overflow-hidden py-0.5"
                            >
                                <div class="truncate text-sm">
                                    {{ node.label }}
                                </div>
                                <!-- spacer div -->
                                <div class="flex-1"></div>
                                <ShowLayerDetailButton
                                    v-if="node.data.category === 'layer'"
                                    class="flex-shrink-0 align-middle"
                                    :layer-id="node.data.layerBodId"
                                />
                                <IconButton
                                    v-if="node.data.category === 'layer'"
                                    class="flex-shrink-0 cursor-pointer align-middle"
                                    :severity="
                                        isOnMap(node.data.layerBodId) ? 'success' : 'secondary'
                                    "
                                    :outlined="!isOnMap(node.data.layerBodId)"
                                    :icon="isOnMap(node.data.layerBodId) ? 'Check' : 'Plus'"
                                    :title="layerToggleTitle(isOnMap(node.data.layerBodId))"
                                    :data-cy="`add-topic-${node.data.layerBodId}`"
                                    @click="onNodeSelect(node)"
                                />
                            </div>
                        </div>
                    </div>
                    <Popover
                        ref="popoverComponent"
                        class="p-0"
                        :pt="{
                            content:
                                'p-0 border-1 border-solid border-swissgeo-blue rounded-xl overflow-hidden',
                            root: 'rounded-xl before:content-none after:content-none',
                        }"
                    >
                        <MapPreview
                            v-if="recordGetCapabilitiesUrl"
                            :key="recordGetCapabilitiesUrl.id"
                            :layer-id="recordGetCapabilitiesUrl.id"
                            :wms-base-url="recordGetCapabilitiesUrl?.href"
                            :selected-layer-name="recordGetCapabilitiesUrl?.name"
                            :bg-layer-name="mainStore.bgLayerId!"
                            @align-overlay="alignOverlay"
                        />
                    </Popover>
                </template>
            </Tree>
        </div>
    </Panel>
</template>
