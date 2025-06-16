<script lang="ts" setup>
import type { TreeNode } from 'primevue/treenode'

import Tree from 'primevue/tree'
import { computed, ref, watch, type PropType } from 'vue'

import { useGeocatalogStore } from '@/store/geocatalog'
import { useMainStore } from '@/store/main'
import { type TopicTreeNode } from '@/types/geocatalog'

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
    // Helper to collect all tree node keys whose node's layerBodId is present in mainStore.layersOnMap
    function collectSelectedKeys(
        nodes: TreeNode[]
    ): Record<string, { checked: boolean; partialChecked: boolean }> {
        const selected: Record<string, { checked: boolean; partialChecked: boolean }> = {}
        const layerIdsOnMap = mainStore.layersOnMap.map((l) => l.id)
        function traverse(node: TreeNode) {
            if (node.data && node.data.layerBodId && layerIdsOnMap.includes(node.data.layerBodId)) {
                selected[node.key] = { checked: true, partialChecked: false }
            }
            if (node.children) {
                node.children.forEach(traverse)
            }
        }
        nodes.forEach(traverse)
        return selected
    }
    return collectSelectedKeys(treeNodes.value)
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

watch(
    () => props.root,
    (root) => {
        if (root) {
            // If root has only one child, show its children as the root nodes
            if (root.children && root.children.length === 1) {
                treeNodes.value = [toPrimeTreeNodes(root.children[0])]
            } else if (root.children && root.children.length > 1) {
                treeNodes.value = root.children.map(toPrimeTreeNodes)
            } else {
                treeNodes.value = [toPrimeTreeNodes(root)]
            }
        }
    },
    { immediate: true }
)

function onNodeSelect(node: TreeNode) {
    if (node.data.category !== 'layer') {
        return
    }
    mainStore.addLayerToMap({
        id: node.data.layerBodId,
        name: node.data.label,
        opacity: 1,
        visible: true,
        geonetworkRecord: null,
    })
}

function onNodeUnselect(node: TreeNode) {
    if (node.data.category !== 'layer') {
        return
    }
    mainStore.deleteLayerById(node.data.layerBodId)
}

function onExpand(node: TreeNode) {
    geocatalogStore.addExpandedKey(node.key)
}

function onCollapse(node: TreeNode) {
    geocatalogStore.removeExpandedKey(node.key)
}
</script>

<template>
    <div class="h-full overflow-hidden">
        <div class="h-full overflow-y-auto">
            <Tree
                :selection-keys="selectedKeys"
                :expanded-keys="expandedKeysObj"
                :value="treeNodes"
                :filter="true"
                filter-placeholder="Filter..."
                :expand-all="false"
                selection-mode="checkbox"
                :pt="{
                    pcNodeCheckbox: (options) => {
                        return options.context.node.data?.category !== 'layer'
                            ? { root: 'hidden' } // hide the checkbox if not a layer
                            : {}
                    },
                }"
                @node-select="onNodeSelect"
                @node-unselect="onNodeUnselect"
                @node-expand="onExpand"
                @node-collapse="onCollapse"
            >
            </Tree>
        </div>
    </div>
</template>
