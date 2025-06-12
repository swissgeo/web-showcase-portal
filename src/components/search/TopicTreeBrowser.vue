<script lang="ts" setup>
import type { TreeNode } from 'primevue/treenode'

import Tree from 'primevue/tree'
import { ref, watch, type PropType } from 'vue'

import AddToMapButton from '@/components/search/AddToMapButton.vue'
import { type TopicTreeNode } from '@/types/geocatalog'

const props = defineProps({
    root: {
        type: Object as PropType<TopicTreeNode>,
        required: true,
    },
})

const treeNodes = ref<TreeNode[]>([])

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

</script>

<template>
    <div class="h-full overflow-hidden">
        <div class="h-full overflow-y-auto">
            <Tree
                :value="treeNodes"
                :filter="true"
                filter-placeholder="Filter..."
                :expand-all="false"
            >
                <template #default="slotProps">
                    <span>{{ slotProps.node.label }}</span>
                    <template v-if="slotProps.node.data.category === 'layer'">
                        <AddToMapButton
                            class="ml-2"
                            :result="slotProps.node.data"
                            :data-cy="`add-layer-from-topic-tree-${slotProps.node.data.layerBodId}`"
                        />
                    </template>
                </template>
            </Tree>
        </div>
    </div>
</template>
