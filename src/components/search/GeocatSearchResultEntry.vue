<script setup lang="ts">
import Popover from 'primevue/popover'
import { computed, inject, ref, type ComputedRef } from 'vue'

import type { GeonetworkRecord } from '@/types/gnRecord'

import LucideIcon from '@/components/general/LucideIcon.vue'
import AddToMapButton from '@/components/search/AddToMapButton.vue'
import MapPreview from '@/components/search/MapPreview.vue'
import SearchResultEntry from '@/components/search/SearchResultEntry.vue'
import ShowLayerDetailButton from '@/components/search/ShowLayerDetailButton.vue'
import { LONG_PRESS_TIMEOUT_MS, useMapPreview } from '@/composables/useMapPreview'
import { useMainStore } from '@/store/main'
import { LayerType } from '@/types/layer'
import { isAddableToMap, transformRecordIntoGetCapabilitiesUrl } from '@/utils/layerUtils'

const isDesktop = inject<ComputedRef<boolean>>('isDesktop')

const { result, bgLayerName } = defineProps<{
    result: GeonetworkRecord
    bgLayerName: string // Optional background layer name
}>()
const mainStore = useMainStore()

const popoverComponent = ref()
const recordGetCapabilitiesUrl = ref()
const { resetMap } = useMapPreview()
const longPressTimeout = ref<NodeJS.Timeout | null>(null) // Timeout reference for long press
const hoverTimeout = ref<NodeJS.Timeout | null>(null) // Timeout reference for hover
const targetRef = ref<EventTarget | null>(null)

const HOVER_TIMEOUT_MS = 100

// provide some debug info
// this is for debugging purposes only and will go away after some time
const tooltipContent = computed(() => {
    const fullTitle = result.title || ''
    const owner = result.ownerOrganization?.name || ''

    return `${fullTitle}\n\n${owner}`
})

const alignOverlay = () => {
    if (popoverComponent?.value) {
        popoverComponent.value.alignOverlay()
    }
}

function initializeGetCapabilitiesUrl() {
    const getCapabilities = transformRecordIntoGetCapabilitiesUrl(result)
    recordGetCapabilitiesUrl.value = {
        href: getCapabilities?.url?.href,
        name: getCapabilities?.name,
    }
}

const addTempPreviewLayerToMap = (record: GeonetworkRecord) => {
    mainStore.setTempPreviewLayer({
        id: record.uniqueIdentifier,
        name: record.title,
        geonetworkRecord: record,
        opacity: 1,
        visible: true,
        type: LayerType.Geonetwork,
    })
}

const handleMouseEnter = async (event: MouseEvent) => {
    if (!isAddableToMap(result) || !isDesktop?.value) {
        return
    }

    targetRef.value = event.currentTarget
    hoverTimeout.value = setTimeout(async () => {
        initializeGetCapabilitiesUrl()
        popoverComponent.value.show(event, targetRef.value)
        addTempPreviewLayerToMap(result)
    }, HOVER_TIMEOUT_MS)
}

const handleMouseLeave = async () => {
    if (hoverTimeout.value) {
        clearTimeout(hoverTimeout.value)
        hoverTimeout.value = null
        popoverComponent.value.hide()
        resetMap()
        mainStore.resetTempPreviewLayer()
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
        initializeGetCapabilitiesUrl()
        if (popoverComponent?.value) {
            // because of the delay we need an extra reference to the current target
            popoverComponent.value.show(event, targetRef.value)
        }
    }, LONG_PRESS_TIMEOUT_MS)
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
        class="flex items-center justify-end gap-2"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
    >
        <LucideIcon
            name="Map"
            class="h-4 w-4 stroke-current"
        />
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
            ref="popoverComponent"
            class="p-0"
            :pt="{
                content: 'p-0 border-1 border-solid border-cyan-800 rounded-xl overflow-hidden',
                root: 'rounded-xl before:content-none after:content-none',
            }"
        >
            <MapPreview
                :layer-id="result.uniqueIdentifier"
                :wms-base-url="recordGetCapabilitiesUrl?.href"
                :selected-layer-name="recordGetCapabilitiesUrl?.name"
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
