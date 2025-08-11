<script setup lang="ts">
import ButtonGroup from 'primevue/buttongroup'
import Toast from 'primevue/toast'
import { computed, onBeforeMount, inject, watch, type Ref } from 'vue'

import IconButton from '@/components/general/IconButton.vue'
import {
    changeZoomLevel,
    generateMapUrlParameters,
    getUrlParamsFromSource,
    ZOOM_DEBOUNCE_DELAY,
} from '@/search/mapUrlUtils'
import { useGroupsStore } from '@/store/groups'
import { useMapStore } from '@/store/map'
import { debounce } from '@/utils/debounce'
import { getEmbedViewerUrl } from '@/utils/environment.config'

const isDesktop = inject<Ref<boolean>>('isDesktop')

const groupsStore = useGroupsStore()
const mapStore = useMapStore()
const mapUrlSearchParams = computed(() => mapStore.mapUrlSearchParams)
const urlString = computed(() => {
    const baseUrl = getEmbedViewerUrl()
    const searchParams = generateMapUrlParameters(mapUrlSearchParams.value)
    return `${baseUrl}?${searchParams.toString()}`
})
const currentZoomLevel = computed(() => mapStore.mapUrlSearchParams.z)

watch(urlString, (value) => {
    // eslint-disable-next-line no-console
    console.debug(value)
})

const debounceChangeZoom = debounce((direction: boolean) => {
    const params = mapStore.mapUrlSearchParams
    params.z = changeZoomLevel(direction, params.z as number)
    mapStore.setMapUrlSearchParams(params)
}, ZOOM_DEBOUNCE_DELAY)

onBeforeMount(() => {
    window.addEventListener('message', onEmbedChange)
    groupsStore.loadGroups()
})

function onEmbedChange(e: MessageEvent) {
    // this catches changes made to the embed map url and send them to the parent component
    if (e?.data?.type === 'gaChange') {
        const oldParams = mapUrlSearchParams.value

        const newParams = getUrlParamsFromSource(e.data.payload.newUrl.split('embed')[1], oldParams)
        // only update if values actually change
        const hasChanged = JSON.stringify(newParams) !== JSON.stringify(oldParams)
        // we don't care about changes to the center parameter, as it is set by the map viewer
        if (!hasChanged || (newParams.center && !oldParams.center)) {
            return
        }
        mapStore.setMapUrlSearchParams(newParams)
    }
}
</script>

<template>
    <!-- pl-20 is used to show the scale bar so it's not covered by the side bar -->
    <iframe
        data-cy="iframe-mapviewer"
        :src="urlString"
        class="h-full w-full lg:pl-20"
        allow="geolocation"
    ></iframe>
    <Toast
        position="bottom-center"
        group="bc"
    />
    <ButtonGroup
        v-if="isDesktop"
        class="absolute right-2 bottom-38 lg:right-6 lg:bottom-8"
        data-cy="zoom-button-group"
    >
        <IconButton
            :disabled="currentZoomLevel === 1"
            data-cy="zoom-out"
            icon="Minus"
            severity="secondary"
            @click="debounceChangeZoom(false)"
        />
        <IconButton
            :disabled="currentZoomLevel === 15"
            data-cy="zoom-in"
            icon="Plus"
            severity="secondary"
            @click="debounceChangeZoom(true)"
        />
    </ButtonGroup>
</template>
