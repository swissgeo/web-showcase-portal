<script lang="ts" setup>
import type { TreeNode } from 'primevue/treenode'

// import TreeNode from 'primevue/tree'
import Tree from 'primevue/tree'
import { ref, watch, type PropType } from 'vue'


interface TopicTreeNode {
  id: number | string
  label?: string
  category: string
  children?: TopicTreeNode[]
  layerBodId?: string
  [key: string]: unknown
}

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
      treeNodes.value = [toPrimeTreeNodes(root)]
    }
  },
  { immediate: true }
)

function onNodeSelect( node: TreeNode ): void {
  const data = node.data as TopicTreeNode
  if (data.category === 'layer') {
    // eslint-disable-next-line no-console
    console.log('Layer info:', data)
  }
}
</script>

<template>
  <div>
    <Tree
      :value="treeNodes"
      :filter="true"
      filter-placeholder="Filter..."
      :expand-all="false"
      selection-mode="single"
      @node-select="onNodeSelect"
    >
      <template #default="slotProps">
        <span>{{ slotProps.node.label }}</span>
        <template v-if="slotProps.node.data.category === 'layer'">
          <button class="ml-2 text-green-600 underline" @click.stop="onNodeSelect(slotProps.node )">Log Layer</button>
        </template>
      </template>
    </Tree>
  </div>
</template>

<style scoped>
button {
  cursor: pointer;
}
</style>
