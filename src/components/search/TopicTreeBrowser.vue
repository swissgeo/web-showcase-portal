<script lang="ts" setup>
import type { TreeNode } from 'primevue/treenode'

import Tree from 'primevue/tree'
import { ref, watch, type PropType } from 'vue'

import { type TopicTreeNode } from '@/types/geocatalog'

const props = defineProps({
    root: {
        type: Object as PropType<TopicTreeNode>,
        required: true,
    },
})

const treeNodes = ref<TreeNode[]>([])
const selectedKey = ref(undefined);

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
                v-model:selection-keys="selectedKey"
                :value="treeNodes"
                :filter="true"
                filter-placeholder="Filter..."
                :expand-all="false"
                selection-mode="checkbox"
                :pt="{
                    pcNodeCheckbox:  (options) => {
                        return options.context.node.data?.category !== 'layer'
                            ? { root: 'hidden' } // hide the checkbox
                            : {};
                        }
                }"
            >
            </Tree>
        </div>
    </div>
</template>
