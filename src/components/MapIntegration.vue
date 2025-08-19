<script setup lang="ts">
import ButtonGroup from 'primevue/buttongroup'
import Toast from 'primevue/toast'
import { computed, onBeforeMount, inject, watch, type Ref, ref } from 'vue'

import IconButton from '@/components/general/IconButton.vue'
import GeolocationButton from '@/components/GeolocationButton.vue'
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
const isUpdatedUrlParameters = computed(() => mapStore.isUpdatedUrlParameters)

const currentZoomLevel = computed(() => mapStore.mapUrlSearchParams.z)
const urlString = ref('')
watch(
    isUpdatedUrlParameters,
    (value) => {
        if (!value) {
            return
        }
        mapStore.setIsUpdatedUrlParameters(false)
        const baseUrl = getEmbedViewerUrl()
        const searchParams = generateMapUrlParameters(mapUrlSearchParams.value)
        urlString.value = `${baseUrl}?${searchParams.toString()}`
    },
    { immediate: true }
)

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
        if (!hasChanged) {
            return
        }
        mapStore.setMapUrlSearchParams(newParams, false) // don't update the map, as this is done by the embed map viewer and it will cause an infinite loop
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
        position="top-center"
        group="bc"
        :pt="{
            root: 'w-[90vw] max-w-sm md:w-auto md:max-w-none',
        }"
    />
    <div
        v-if="isDesktop"
        class="absolute right-2 bottom-8 flex flex-col items-end gap-3 lg:right-6"
    >
        <GeolocationButton />
        <ButtonGroup data-cy="zoom-button-group">
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
    </div>
</template>
