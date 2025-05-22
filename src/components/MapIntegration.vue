<script setup lang="ts">
import Button from 'primevue/button'
import ButtonGroup from 'primevue/buttongroup'
import { computed, onBeforeMount, inject, watch, type Ref } from 'vue'

import {
    changeZoomLevel,
    generateMapUrlParameters,
    getUrlParamsFromSource,
} from '@/search/mapUrlUtils'
import { useMapStore } from '@/store/map'
import { getEmbedViewerUrl } from '@/utils/environment.config'

const isDesktop = inject<Ref<boolean>>('isDesktop')

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

function changeZoom(direction: boolean) {
    const params = mapStore.mapUrlSearchParams
    params.z = changeZoomLevel(direction, params.z as number)
    mapStore.setMapUrlSearchParams(params)
}

onBeforeMount(() => {
    window.addEventListener('message', onEmbedChange)
})

function onEmbedChange(e: MessageEvent) {
    // this catches changes made to the embed map url and send them to the parent component
    if (e?.data?.type === 'gaChange') {
        mapStore.setMapUrlSearchParams(
            getUrlParamsFromSource(
                e.data.payload.newUrl.split('embed')[1],
                mapUrlSearchParams.value
            )
        )
    }
}
</script>

<template>
    <iframe
        data-cy="iframe-mapviewer"
        :src="urlString"
        class="h-full w-full"
        allow="geolocation"
    ></iframe>
    <ButtonGroup
        v-if="isDesktop"
        class="absolute right-2 bottom-38 md:right-6 md:bottom-8"
        data-cy="zoom-button-group"
    >
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
