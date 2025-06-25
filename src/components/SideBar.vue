<script lang="ts" setup>
import { UnfoldHorizontal } from 'lucide-vue-next'
import { computed, onBeforeUnmount } from 'vue'

import GeocatalogButton from '@/components/GeocatalogButton.vue'
import LanguageSwitchButton from '@/components/LanguageSwitchButton.vue'
import LayerCart from '@/components/LayerCart.vue'
import LayerCartButton from '@/components/LayerCartButton.vue'
import LogoPic from '@/components/LogoPic.vue'
import TopicTreeBrowser from '@/components/search/TopicTreeBrowser.vue'
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
    newWidth = Math.max(
        SIDEBAR_MIN_WIDTH,
        Math.min(SIDEBAR_MAX_WIDTH, newWidth)
    )
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
    uiStore.$reset()
    searchStore.$reset()
    mainStore.$reset()
    mapStore.$reset()
}

updateGeocatalogLanguage()
// Initialize topic tree with reactive updates
initializeTopicTree()

// Cleanup function to ensure no hanging event listeners
onBeforeUnmount(() => {
    if (isDragging) {
        stopDragging()
    }
})
</script>

<template>
    <div class="absolute top-0 left-0 z-10 flex h-screen w-auto flex-col bg-neutral-100 shadow-lg">
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
                    <LayerCartButton />
                    <GeocatalogButton />
                </div>
                <LanguageSwitchButton class="w-19 py-5" />
            </div>
            <!-- Second column -->
            <div
                v-show="uiStore.isLayerCartVisible || uiStore.isGeocatalogTreeVisible"
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

                <!-- Draggable resize handle -->
                <div
                    class="flex w-2 max-w-[2px] min-w-[2px] cursor-col-resize items-center justify-center bg-white hover:bg-gray-400 select-none"
                    @mousedown="startDragging"
                >
                    <UnfoldHorizontal class="w-4 flex-shrink-0 bg-white pointer-events-none" />
                </div>
            </div>
        </div>
    </div>
</template>
