<script setup lang="ts">
import Panel from 'primevue/panel'
import Sortable from 'sortablejs'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

import type { Layer } from '@/types/layer'

import IconButton from '@/components/general/IconButton.vue'
import LayerItem from '@/components/LayerItem.vue'
import { useMainStore } from '@/store/main'
import { SidebarType, useUiStore } from '@/store/ui'

const { t } = useI18n()

const props = defineProps({
    isDesktopView: {
        type: Boolean,
        default: true,
    },
})

const mainStore = useMainStore()
const uiStore = useUiStore()

const activeLayersList = ref(null)

const activeLayers = computed(() => mainStore.layersOnMap.slice().reverse() || [])
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
        :header="t('layerCart.title')"
        :pt="{
            root: 'md:rounded-t-none md:shadow-none',
            header: 'md:justify-between justify-center md:bg-[#F3F8F8]',
            title: 'order-2 md:order-1',
            headerActions: 'absolute left-4 md:static md:order-2',
        }"
    >
        <template #icons>
            <IconButton
                v-if="!props.isDesktopView"
                severity="secondary"
                outlined
                class="order-1"
                icon="ChevronLeft"
                @click="uiStore.toggleSidebar(SidebarType.LAYER_CART)"
            >
            </IconButton>
            <IconButton
                v-if="props.isDesktopView"
                severity="secondary"
                size="medium"
                icon-class="h-5 text-[#1E485B]"
                :text="true"
                icon="PanelLeftClose"
                @click="uiStore.toggleSidebar(SidebarType.LAYER_CART)"
            >
            </IconButton>
        </template>
        <div
            class="flex flex-row items-center p-2"
            :class="{
                'justify-between': props.isDesktopView,
                'justify-start': !props.isDesktopView,
            }"
        ></div>
        <div>
            <ul
                v-if="activeLayers.length > -1"
                ref="activeLayersList"
                class="space-y-2"
            >
                <LayerItem
                    v-for="layer in activeLayers"
                    :key="layer.id"
                    :layer="layer"
                    class="layer-item"
                    @delete-layer="handleDeleteLayer"
                />
            </ul>
            <p v-else>{{ t('layerCart.noLayers') }}</p>
        </div>

        <Panel
            :header="t('layerCart.backgroundMap')"
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
