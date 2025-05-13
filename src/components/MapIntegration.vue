<script setup lang="ts">
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

watch(urlString, (value) => {
    // eslint-disable-next-line no-console
    console.debug(value)
})

function changeZoom(direction) {
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
    <span class="row absolute right-32 bottom-16 flex">
        <button
            @click="changeZoom(false)"
            class="size-8 rounded-md rounded-r-none bg-gray-50 shadow-md hover:bg-gray-100 hover:shadow-lg"
        >
            -
        </button>
        <button
            @click="changeZoom(true)"
            class="size-8 rounded-md rounded-l-none bg-gray-50 shadow-md hover:bg-gray-100 hover:shadow-lg"
        >
            +
        </button>
    </span>
</template>
