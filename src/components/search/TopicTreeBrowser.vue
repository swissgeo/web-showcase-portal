<script lang="ts" setup>
import type { TreeNode } from 'primevue/treenode'

import Tree from 'primevue/tree'
import { computed, ref, watch, type PropType } from 'vue'

import { useGeocatalogStore } from '@/store/geocatalog'
import { useMainStore } from '@/store/main'
import { type TopicTreeNode } from '@/types/geocatalog'
import { LayerType } from '@/types/layer'

const mainStore = useMainStore()
const geocatalogStore = useGeocatalogStore()

const props = defineProps({
    root: {
        type: [Object, null] as PropType<TopicTreeNode | null>,
        required: true,
    },
})

const treeNodes = ref<TreeNode[]>([])

// This function determines which nodes in the topic tree should appear as selected (checked) in the UI.
function collectSelectedKeys(
    nodes: TreeNode[],
    layerIdsOnMap: string[]
): Record<string, { checked: boolean; partialChecked: boolean }> {
    // This object will store the selected state for each node key
    const selected: Record<string, { checked: boolean; partialChecked: boolean }> = {}

    // Recursively traverse the tree nodes
    function traverse(node: TreeNode) {
        // Check if the node represents a layer and is present on the map
        const isNodeSelected =
            node.data && node.data.layerBodId && layerIdsOnMap.includes(node.data.layerBodId)

        if (isNodeSelected) {
            // Mark this node as checked (follow the PrimeVue TreeNode selection structure)
            selected[node.key] = { checked: true, partialChecked: false }
        }

        // If the node has children, traverse them as well
        node.children?.forEach(traverse)
    }

    // Start the traversal from the root nodes
    nodes.forEach(traverse)

    return selected
}

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

// Helper to set the treeNodes based on the root node structure
function setTreeNodesFromRoot(root: TopicTreeNode | null) {
    if (!root) {
        return
    }
    // If root has only one child, show its children as the root nodes
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
    if (node.data.category !== 'layer') {
        return
    }
    mainStore.addLayerToMap({
        id: node.data.layerBodId,
        name: node.data.label,
        opacity: 1,
        visible: true,
        geonetworkRecord: null,
        type: LayerType.Geocatalog,
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
    <div class="h-full overflow-hidden overflow-y-auto">
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
</template>
