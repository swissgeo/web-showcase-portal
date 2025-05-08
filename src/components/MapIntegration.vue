<script setup lang="ts">
import { computed, watch } from 'vue'

import { generateMapUrlParameters } from '@/search/mapUrlUtils'
import { useMapStore } from '@/store/map'

const mapStore = useMapStore()
const urlString = computed(() => {
    const baseUrl = 'https://map.geo.admin.ch/#embed'
    const searchParams = generateMapUrlParameters(mapStore.mapUrlSearchParams)
    return `${baseUrl}/?${searchParams.toString()}`
})

watch(urlString, (value) => {
    // eslint-disable-next-line no-console
    console.debug(value)
})
</script>

<template>
    <iframe
        data-cy="iframe-mapviewer"
        :src="urlString"
        class="h-fit w-full"
        allow="geolocation"
    ></iframe>
</template>
