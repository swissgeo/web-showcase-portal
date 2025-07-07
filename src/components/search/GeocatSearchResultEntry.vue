<script setup lang="ts">
import Popover from 'primevue/popover'
import { computed, inject, ref, type ComputedRef } from 'vue'

import type { GeonetworkRecord } from '@/types/gnRecord'

import MapIcon from '@/assets/icons/map.svg?use'
import AddToMapButton from '@/components/search/AddToMapButton.vue'
import MapPreview from '@/components/search/MapPreview.vue'
import SearchResultEntry from '@/components/search/SearchResultEntry.vue'
import ShowLayerDetailButton from '@/components/search/ShowLayerDetailButton.vue'
import { useMapPreview } from '@/composables/useMapPreview'
import { isAddableToMap, transformRecordIntoGetCapabilitiesUrl } from '@/utils/layerUtils'

const isDesktop = inject<ComputedRef<boolean>>('isDesktop')

const { result, bgLayerName } = defineProps<{
    result: GeonetworkRecord
    bgLayerName: string // Optional background layer name
}>()
const op = ref()
const selectedHref = ref()
const { resetMap } = useMapPreview()
const longPressTimeout = ref<NodeJS.Timeout | null>(null) // Timeout reference for long press
const targetRef = ref<EventTarget | null>(null)
// provide some debug info
// this is for debugging purposes only and will go away after some time
const tooltipContent = computed(() => {
    const fullTitle = result.title || ''
    const owner = result.ownerOrganization?.name || ''

    return `${fullTitle}\n\n${owner}`
})

const alignOverlay = () => {
    if (op?.value) {
        op.value.alignOverlay()
    }
}

function initializeHref() {
    const onlineResource = transformRecordIntoGetCapabilitiesUrl(result)
    selectedHref.value = {
        href: onlineResource?.url?.href,
        name: onlineResource?.name,
    }
}
const handleMouseEnter = (event: MouseEvent) => {
    if (!isAddableToMap(result) || !isDesktop?.value) {
        return
    }
    initializeHref()
    op.value.show(event) // Show the popover on hover
}

const handleMouseLeave = () => {
    if (op.value) {
        op.value.hide() // Hide the popover on hover out
        resetMap()
    }
}

// Function to handle long press on mobile
const handleTouchStart = async (event: TouchEvent) => {
    if (!isAddableToMap(result) || isDesktop?.value) {
        return
    }
    targetRef.value = event.currentTarget
    // Set a timeout to detect a long press (e.g., 500ms)
    longPressTimeout.value = setTimeout(async () => {
        initializeHref()
        if (op?.value) {
            // because of the delay we need an extra reference to the current target
            op.value.show(event, targetRef.value)
        }
    }, 500)
}

// Function to clear the timeout if the touch ends before the long press threshold
const handleTouchEnd = () => {
    if (longPressTimeout.value) {
        clearTimeout(longPressTimeout.value) // Clear the timeout
        longPressTimeout.value = null
    }
}
</script>

<template>
    <SearchResultEntry
        class="flex justify-end gap-2"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
    >
        <MapIcon class="h-4 w-4 overflow-hidden stroke-current" />
        <div
            class="mr-auto flex-1 truncate"
            :class="{
                'no-select': !isDesktop,
            }"
            :title="tooltipContent"
        >
            {{ result.title }}
        </div>
        <ShowLayerDetailButton
            class="shrink-0"
            :layer-id="result.uniqueIdentifier"
        />
        <AddToMapButton
            v-if="isAddableToMap(result)"
            class="shrink-0"
            :result="result"
        />
        <div
            v-else
            class="w-10"
        >
            <!-- we need an empty element so the i button stays-->
        </div>
        <Popover
            ref="op"
            class="p-0"
            :pt="{
                content: 'p-0',
            }"
        >
            <MapPreview
                :wms-base-url="selectedHref?.href"
                :selected-layer-name="selectedHref?.name"
                :bg-layer-name="bgLayerName"
                @align-overlay="alignOverlay"
            />
        </Popover>
    </SearchResultEntry>
</template>

<style>
.no-select {
    user-select: none; /* Prevent text selection */
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* Internet Explorer/Edge */
}
</style>
