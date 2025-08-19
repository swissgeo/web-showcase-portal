<script lang="ts" setup>
import { UnfoldHorizontal } from 'lucide-vue-next'
import { computed, onBeforeUnmount, ref } from 'vue'

import type SearchSidebarType from '@/components/search/SearchSidebar.vue'

import LanguageSwitchButton from '@/components/LanguageSwitchButton.vue'
import LayerCart from '@/components/LayerCart.vue'
import LogoPic from '@/components/LogoPic.vue'
import FeedbackButton from '@/components/menu/FeedbackButton.vue'
import GeocatalogTreeButton from '@/components/menu/GeocatalogTreeButton.vue'
import LayerCartButton from '@/components/menu/LayerCartButton.vue'
import ProjectInfoButton from '@/components/menu/ProjectInfoButton.vue'
import SearchPanelButton from '@/components/menu/SearchPanelButton.vue'
import SearchSidebar from '@/components/search/SearchSidebar.vue'
import TopicTreeBrowser from '@/components/search/TopicTreeBrowser.vue'
import { useResetApp } from '@/composables/useResetAppComposable'
import { useTopicTree } from '@/composables/useTopicTree'
import { useUiStore, SIDEBAR_MIN_WIDTH, SIDEBAR_MAX_WIDTH } from '@/store/ui'

const { topicTreeRoot, updateGeocatalogLanguage } = useTopicTree()
const searchSidebarRef = ref<InstanceType<typeof SearchSidebarType> | null>(null)

const uiStore = useUiStore()
const { resetApp } = useResetApp()

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
    document.addEventListener('mousemove', handleDragging)
    document.addEventListener('mouseup', stopDragging)
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
    if (searchSidebarRef.value) {
        searchSidebarRef.value.containerStopDragging()
    }
}

updateGeocatalogLanguage()

// Cleanup function to ensure no hanging event listeners
onBeforeUnmount(() => {
    stopDragging()
})
</script>

<template>
    <div class="absolute top-0 left-0 z-10 flex h-screen w-auto shadow-lg">
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
            <div class="flex min-h-0 w-full flex-1 flex-row border-t border-neutral-100 p-0">
                <!-- First column -->
                <div class="flex h-full min-w-16 flex-col items-center justify-between pt-4">
                    <div class="flex flex-col items-center gap-2">
                        <SearchPanelButton />
                        <LayerCartButton />
                        <GeocatalogTreeButton />
                        <FeedbackButton />
                        <ProjectInfoButton />
                    </div>
                    <LanguageSwitchButton class="w-19 py-5" />
                </div>
                <!-- Second column -->
                <div
                    v-show="uiStore.isSidebarOpen"
                    :style="{ width: sidebarSecondColumnWidth + 'px' }"
                    class="relative flex h-full overflow-y-auto bg-white transition-[width] duration-75 ease-out"
                    :class="{ 'transition-none': isDragging }"
                >
                    <LayerCart
                        v-show="uiStore.isLayerCartVisible"
                        class="w-full"
                    />
                    <TopicTreeBrowser
                        v-show="uiStore.isGeocatalogTreeVisible"
                        :root="topicTreeRoot"
                        class="w-full"
                    />
                    <SearchSidebar
                        v-show="uiStore.isSearchVisible"
                        ref="searchSidebarRef"
                        class="w-full"
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
            <UnfoldHorizontal class="pointer-events-none w-6 flex-shrink-0" />
        </div>
    </div>
</template>
