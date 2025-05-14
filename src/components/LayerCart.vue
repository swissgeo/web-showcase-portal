<script setup lang="ts">
import { PanelRightOpen } from 'lucide-vue-next';
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import Panel from 'primevue/panel'
import Sortable from 'sortablejs'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

import type { Layer } from '@/types/Layer'

import LayerItem from '@/components/LayerItem.vue'
import { useMainStore } from '@/store/main'
import { useUiStore } from '@/store/ui'

const { t } = useI18n()

const props = defineProps({
    isDesktopView: {
        type: Boolean,
        default: true,
    }
});

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
            handle: '.layer-item-drag-handle',
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
        class="h-full overflow-y-auto"
    >
        <div
            class="flex flex-row items-center p-2"
            :class="{ 'justify-between': isDesktopView, 'justify-start': !isDesktopView }"
        >
            <Button
                v-if="!props.isDesktopView"
                class="mr-2"
                severity="secondary"
                size="medium"
                @click="uiStore.toggleLayerCart"
            >
                <template #icon>
                    <PanelRightOpen/>
                </template>
            </Button>
            <h2
                class="text-xl font-bold m-0"
                :class="{ 'flex-grow text-center': !isDesktopView, 'text-left': isDesktopView }"
            >
                {{ t('Maps displayed') }}
            </h2>
            <Button
                v-if="props.isDesktopView"
                severity="secondary"
                size="medium"
                @click="uiStore.toggleLayerCart"
            >
                <template #icon>
                    <PanelRightOpen/>
                </template>
            </Button>
        </div>
        <Divider/>
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
