<script setup lang="ts">
import Button from 'primevue/button'
import ButtonGroup from 'primevue/buttongroup'
import { computed, watch } from 'vue'

import { changeZoomLevel, generateMapUrlParameters } from '@/search/mapUrlUtils'
import { useMapStore } from '@/store/map'
import { getEmbedViewerUrl } from '@/utils/environment.config'

const mapStore = useMapStore()
const urlString = computed(() => {
    const baseUrl = getEmbedViewerUrl()
    const searchParams = generateMapUrlParameters(mapStore.mapUrlSearchParams)
    return `${baseUrl}?${searchParams.toString()}`
})
const currentZoomLevel = computed(() => mapStore.mapUrlSearchParams.z)

watch(urlString, (value) => {
    // eslint-disable-next-line no-console
    console.debug(value)
})

function changeZoom(direction: boolean) {
    const params = mapStore.mapUrlSearchParams
    params.z = changeZoomLevel(direction, params.z)
    mapStore.setMapUrlSearchParams(params)
}
</script>

<template>
    <iframe
        data-cy="iframe-mapviewer"
        :src="urlString"
        class="h-full w-full"
        allow="geolocation"
    ></iframe>
    <ButtonGroup class="absolute right-2 bottom-38 md:right-6 md:bottom-8" data-cy="zoom-button-group">
        <Button
            :disabled="currentZoomLevel === 1"
            data-cy="zoom-out"
            icon="pi pi-minus"
            severity="secondary"
            @click="changeZoom(false)"
        />
        <Button
            :disabled="currentZoomLevel === 15"
            data-cy="zoom-in"
            icon="pi pi-plus"
            severity="secondary"
            @click="changeZoom(true)"
        />
    </ButtonGroup>
</template>
