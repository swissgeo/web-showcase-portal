<script lang="ts" setup>
import { UnfoldHorizontal } from 'lucide-vue-next'
import { computed, onBeforeUnmount } from 'vue'

import GeocatalogTreeButton from '@/components/GeocatalogTreeButton.vue'
import LanguageSwitchButton from '@/components/LanguageSwitchButton.vue'
import LayerCart from '@/components/LayerCart.vue'
import LayerCartButton from '@/components/LayerCartButton.vue'
import LogoPic from '@/components/LogoPic.vue'
import SearchResponsive from '@/components/search/SearchResponsive.vue'
import TopicTreeBrowser from '@/components/search/TopicTreeBrowser.vue'
import SearchPanelButton from '@/components/SearchPanelButton.vue'
import { useTopicTree } from '@/composables/useTopicTree'
import { useMainStore } from '@/store/main'
import { useMapStore } from '@/store/map'
import { useSearchStore } from '@/store/search'
import { useUiStore, SIDEBAR_MIN_WIDTH, SIDEBAR_MAX_WIDTH } from '@/store/ui'

const { topicTreeRoot, updateGeocatalogLanguage } = useTopicTree()

const uiStore = useUiStore()
const mapStore = useMapStore()
const mainStore = useMainStore()
const searchStore = useSearchStore()

const sidebarSecondColumnWidth = computed({
    get() {
        return uiStore.sidebarSecondColumnWidth
    },
    set(value: number) {
        uiStore.setSidebarSecondColumnWidth(value)
    },
})

let isDragging = false

function startDragging(event: MouseEvent) {
    event.preventDefault()
    isDragging = true
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'
    window.addEventListener('mousemove', handleDragging)
    window.addEventListener('mouseup', stopDragging)
    // Add document event listeners as backup
    document.addEventListener('mouseup', stopDragging)
    document.addEventListener('mouseleave', stopDragging)
    // Also listen for blur events in case user switches tabs/windows
    window.addEventListener('blur', stopDragging)
}

function handleDragging(event: MouseEvent) {
    if (!isDragging) {
        return
    }

    // Check if left mouse button is still pressed
    if (event.buttons !== 1) {
        stopDragging()
        return
    }

    event.preventDefault()
    const deltaX = event.movementX || 0
    let newWidth = sidebarSecondColumnWidth.value + deltaX
    newWidth = Math.max(SIDEBAR_MIN_WIDTH, Math.min(SIDEBAR_MAX_WIDTH, newWidth))
    sidebarSecondColumnWidth.value = newWidth
}

function stopDragging() {
    if (!isDragging) {
        return
    }

    isDragging = false
    document.body.style.userSelect = ''
    document.body.style.cursor = ''

    // Remove all event listeners
    window.removeEventListener('mousemove', handleDragging)
    window.removeEventListener('mouseup', stopDragging)
    document.removeEventListener('mouseup', stopDragging)
    document.removeEventListener('mouseleave', stopDragging)
    window.removeEventListener('blur', stopDragging)
}

function resetApp() {
    uiStore.resetStore()
    searchStore.resetStore()
    mainStore.resetStore()
    mapStore.resetStore()
}

updateGeocatalogLanguage()

// Cleanup function to ensure no hanging event listeners
onBeforeUnmount(() => {
    stopDragging()
})
</script>

<template>
    <div class="absolute top-0 left-0 z-10 flex h-screen w-auto bg-neutral-100 shadow-lg">
        <div class="flex flex-col">
            <div
                class="flex-shrink-0 cursor-pointer bg-white"
                @click="resetApp"
            >
                <LogoPic
                    class="h-12"
                    :condensed="!uiStore.isSidebarOpen"
                />
            </div>
            <div class="flex min-h-0 w-full flex-1 flex-row p-0">
                <!-- First column -->
                <div
                    class="flex h-full min-w-16 flex-col items-center justify-between bg-neutral-100 pt-4"
                >
                    <div class="flex flex-col items-center gap-2">
                        <SearchPanelButton />
                        <LayerCartButton />
                        <GeocatalogTreeButton />
                    </div>
                    <LanguageSwitchButton class="w-19 py-5" />
                </div>
                <!-- Second column -->
                <div
                    v-show="uiStore.isLayerCartVisible || uiStore.isGeocatalogTreeVisible || uiStore.isSearchVisible"
                    class="relative flex"
                >
                    <LayerCart
                        v-show="uiStore.isLayerCartVisible"
                        :style="{ width: sidebarSecondColumnWidth + 'px' }"
                        class="h-full overflow-y-auto bg-white"
                    />
                    <TopicTreeBrowser
                        v-if="uiStore.isGeocatalogTreeVisible"
                        :root="topicTreeRoot"
                        :style="{ width: sidebarSecondColumnWidth + 'px' }"
                        class="h-full overflow-y-auto bg-white"
                    />
                    <SearchResponsive
                        v-if="uiStore.isSearchVisible"
                        :is-sidebar="true"
                        :style="{ width: sidebarSecondColumnWidth + 'px' }"
                        class="h-full overflow-y-auto bg-white"
                    />
                </div>
            </div>
        </div>
        <!-- Draggable resize handle -->
        <div
            v-if="uiStore.isSidebarOpen"
            class="z-1 flex w-2 max-w-[2px] min-w-[2px] cursor-col-resize items-center justify-center bg-white select-none hover:bg-gray-400"
            @mousedown="startDragging"
        >
            <UnfoldHorizontal class="pointer-events-none w-4 flex-shrink-0" />
        </div>
    </div>
</template>
