<script setup lang="ts">
import Button from 'primevue/button'
import Panel from 'primevue/panel'
import Sortable from 'sortablejs'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

import type { Layer } from '@/types/Layer'

import { useMainStore } from '@/store/main'
import { useUiStore } from '@/store/ui'

const { t } = useI18n()

import LayerItem from './LayerItem.vue'

const mainStore = useMainStore()
const uiStore = useUiStore()

const activeLayersList = ref(null)

const layers = computed(() => mainStore.layersOnMap || [])
const bgLayers = computed(() => mainStore.bgLayers || [])

const handleDeleteLayer = (layer: Layer) => {
    mainStore.deleteLayerById(layer.id)
}

let sortable: typeof Sortable | null = null

onMounted(() => {
    initSortable()
})

onUnmounted(() => {
    destroySortable()
})

function initSortable() {
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
}

function destroySortable() {
    if (sortable) {
        sortable.destroy()
    }
}
</script>

<template>
    <Panel
        header="Maps displayed"
        :style="{ width: '350px' }"
    >
        <template #icons>
            <Button
                :text="true"
                class="p-panel-header-icon p-link cursor-pointer"
                icon="pi pi-chevron-left"
                @click="uiStore.setLayerCartVisible(false)"
            >
            </Button>
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
            <p v-else>{{ t('layerCart.noLayers') }}</p>
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
