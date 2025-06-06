<script lang="ts" setup>
import { UnfoldHorizontal } from 'lucide-vue-next'
import Badge from 'primevue/badge'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import AddressResultList from '@/components/search/AddressResultList.vue'
import GeocatResultList from '@/components/search/GeocatResultList.vue'
import SearchSpinner from '@/components/search/SearchSpinner.vue'
import useSearchResults from '@/components/search/useSearchResults'
import {
    SEARCH_RESULTS_DESKTOP_COLUMN_MAX_WIDTH,
    SEARCH_RESULTS_DESKTOP_COLUMN_MIN_WIDTH,
} from '@/search'
import { useSearchStore } from '@/store/search'

const { t } = useI18n()

const {
    showGeocatSpinner,
    showAddressSpinner,
    addressSearchResultCount,
    geocatSearchResultCount,
    isSearching,
} = useSearchResults()

const searchStore = useSearchStore()

const dataSearchPanelWidth = computed({
    get() {
        return searchStore.dataSearchPanelWidth
    },
    set(value: number) {
        searchStore.setDataSearchPanelWidth(value)
    },
})
let isDragging = false

function startDragging() {
    isDragging = true
    window.addEventListener('mousemove', handleDragging)
    window.addEventListener('mouseup', stopDragging)
}

function handleDragging(event: MouseEvent) {
    if (!isDragging) return
    // Calculate the delta movement
    const deltaX = event.movementX || 0
    let newWidth = dataSearchPanelWidth.value + deltaX
    newWidth = Math.max(
        SEARCH_RESULTS_DESKTOP_COLUMN_MIN_WIDTH,
        Math.min(SEARCH_RESULTS_DESKTOP_COLUMN_MAX_WIDTH, newWidth)
    )
    dataSearchPanelWidth.value = newWidth
}

function stopDragging() {
    isDragging = false
    window.removeEventListener('mousemove', handleDragging)
    window.removeEventListener('mouseup', stopDragging)
}
</script>

<template>
    <div class="relative flex bg-white md:overflow-visible">
        <!-- Left panel -->
        <div
            :style="{ width: dataSearchPanelWidth + 'px' }"
            class="flex max-w-full min-w-0 flex-shrink-0"
        >
            <div class="relative flex h-full min-h-full w-full flex-col">
                <div
                    v-if="isSearching"
                    class="flex items-center gap-2 font-bold"
                >
                    {{ t('searchResult.dataTitle') }}
                    <Badge :value="geocatSearchResultCount" />
                </div>
                <SearchSpinner v-if="showGeocatSpinner" />
                <GeocatResultList class="overflow-auto" />
            </div>
        </div>

        <!-- Draggable divider -->
        <div
            class="flex w-2 max-w-[2px] min-w-[2px] cursor-col-resize items-center justify-center bg-gray-300 hover:bg-gray-400"
            @mousedown="startDragging"
        >
            <UnfoldHorizontal class="w-4 flex-shrink-0 bg-white" />
        </div>

        <!-- Right panel -->
        <div class="flex min-w-0 flex-1">
            <div class="relative flex h-full w-full flex-col overflow-hidden">
                <div
                    v-if="isSearching"
                    class="flex items-center gap-2 font-bold"
                >
                    {{ t('searchResult.placesTitle') }}
                    <Badge :value="addressSearchResultCount" />
                </div>
                <SearchSpinner v-if="showAddressSpinner" />
                <AddressResultList
                    v-else
                    class="overflow-x-hidden overflow-y-auto text-ellipsis"
                />
            </div>
        </div>
    </div>
</template>
