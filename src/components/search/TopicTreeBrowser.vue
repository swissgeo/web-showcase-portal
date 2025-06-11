<script lang="ts" setup>
import type { TreeNode } from 'primevue/treenode'

import Button from 'primevue/button'
import Tree from 'primevue/tree'
import { ref, watch, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'

import { useMainStore } from '@/store/main'

const { t } = useI18n()

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
const mainStore = useMainStore()

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

function addLayerToMapFromNode(node: TreeNode) {
  const data = node.data as TopicTreeNode
  if (data.category === 'layer' && data.layerBodId) {
    // Fix me, use the same logic as in AddToMapButton.vue
    mainStore.addLayerToMap({
      id: data.layerBodId,
      name: String(data.label),
      opacity: 1,
      visible: true,
      geonetworkRecord: null,  // FIXME
    })
  }
}
</script>

<template>
  <div class="h-full overflow-hidden">
    <div class="h-full overflow-y-auto">
      <Tree
        :value="treeNodes"
        :filter="true"
        filter-placeholder="Filter..."
        :expand-all="false"
        selection-mode="single"
      >
        <template #default="slotProps">
          <span>{{ slotProps.node.label }}</span>
          <template v-if="slotProps.node.data.category === 'layer'">
            <Button
              class="ml-2"
              size="small"
              severity="secondary"
              :data-cy="`add-layer-from-topic-tree-${slotProps.node.data.layerBodId}`"
              @click.stop="addLayerToMapFromNode(slotProps.node)"
            >
              {{ t('searchResult.addToMap') }}
            </Button>
          </template>
        </template>
      </Tree>
    </div>
  </div>
</template>

<style scoped>
button {
  cursor: pointer;
}
</style>
