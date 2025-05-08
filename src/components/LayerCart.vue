<script setup lang="ts">
import Panel from 'primevue/panel'
import Sortable from 'sortablejs'
import { ref, computed, onMounted, onUnmounted } from 'vue'

import type { Layer } from '@/types/Layer'

import { useMainStore } from '@/store/main'
import { useUiStore } from '@/store/ui'

import LayerItem from './LayerItem.vue'

const mainStore = useMainStore()
const uiStore = useUiStore()

const activeLayersList = ref(null)

const layers = computed(() => mainStore.layersOnMap || [])
const bgLayers = computed(() => mainStore.bgLayers || [])

const handleDeleteLayer = (layer: Layer) => {
    mainStore.deleteLayerById(layer.id)
}

let sortable: Sortable | null = null
onMounted(() => {
    if (activeLayersList.value === null) {
        return
    } else {
        sortable = Sortable.create(activeLayersList.value, {
            delay: 250,
            delayOnTouchOnly: true,
            touchStartThreshold: 3,
            animation: 150,
            direction: 'vertical',
            onEnd: (event: { oldIndex: number; newIndex: number }) => {
                mainStore.moveLayerToIndex(event.oldIndex, event.newIndex)
            },
        })
    }
})

onUnmounted(() => {
    if (sortable) {
        sortable.destroy()
    }
})
</script>

<template>
    <Panel
        header="Maps displayed"
        :style="{ width: '350px' }"
    >
        <template #icons>
            <button
                class="p-panel-header-icon p-link mr-1 cursor-pointer"
                @click="uiStore.setLayerCartVisible(false)"
            >
                <span class="pi pi-chevron-left"></span>
            </button>
        </template>
        <div>
            <ul
                v-if="layers.length > -1"
                ref="activeLayersList"
                class="space-y-2"
            >
                <LayerItem
                    v-for="layer in layers"
                    :key="layer.id"
                    :layer="layer"
                    class="layer-item"
                    @delete-layer="handleDeleteLayer"
                />
            </ul>
            <p v-else>No layers selected.</p>
        </div>

        <Panel
            header="Background Layer"
            class="mt-2"
        >
            <ul
                v-if="bgLayers.length > 0"
                class="space-y-2"
            >
                <LayerItem
                    v-for="layer in bgLayers"
                    :key="layer.id"
                    :layer="layer"
                    :is-bg-layer="true"
                />
            </ul>
        </Panel>
    </Panel>
</template>

<style scoped>
/* Add any additional styles here */
</style>
