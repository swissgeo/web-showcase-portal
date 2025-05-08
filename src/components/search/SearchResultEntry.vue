<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import { computed } from 'vue'

import type { GeonetworkRecord } from '@/types/gnRecord'

import { useMainStore } from '@/store/main'
import { getServiceResource, isAddableToMap } from '@/utils/layerUtils'

const { result } = defineProps<{
    result: GeonetworkRecord
}>()

const mainStore = useMainStore()
const { isLayerOnMap } = storeToRefs(mainStore)

// provide some debug info
// this is for debugging purposes only and will go away after some time
const tooltipContent = computed(() => {
    const owner = result.ownerOrganization?.name || ''
    const title = result.title || ''

    return `Owner: ${owner}\nTitle: ${title}`
})

// provide some debug info on the wms/wmts service
// this is for debugging purposes only and will go away after some time
const layerTooltipContent = computed(() => {
    const wmsResource = getServiceResource('wms', result)
    const wmtsResource = getServiceResource('wms', result)

    if (!wmsResource && !wmtsResource) {
        return ''
    }

    let url, name
    if (wmsResource) {
        url = wmsResource.url.origin
        name = wmsResource.name
    }
    if (wmtsResource) {
        url = wmtsResource.url.origin
        name = wmtsResource.name
    }

    return `Url: ${url}\nName: ${name}`
})

const addToMap = (record: GeonetworkRecord) => {
    mainStore.addLayerToMap({
        id: record.uniqueIdentifier,
        name: record.title,
        geonetworkRecord: record,
        opacity: 1,
        visible: true,
    })
}

const showLayerInfo = (layerId: string) => {
    mainStore.setInfoLayerId(layerId)
}
</script>

<template>
    <li
        class="mt-2 flex items-center justify-between gap-4 border border-solid border-gray-200 px-2 py-1 text-sm"
        :class="{ 'text-gray-400': isLayerOnMap(result.uniqueIdentifier) }"
    >
        <div class="flex flex-col">
            <div
                class=""
                :title="tooltipContent"
            >
                {{ result.title }}
            </div>
        </div>
        <div>
            <div class="flex gap-2">
                <Button
                    severity="secondary"
                    class="mr-auto cursor-pointer hover:text-gray-400"
                    size="small"
                    icon="pi pi-info-circle"
                    title="Show info"
                    @click="showLayerInfo(result.uniqueIdentifier)"
                >
                </Button>
                <Button
                    v-if="isAddableToMap(result)"
                    size="small"
                    severity="secondary"
                    :title="layerTooltipContent"
                    class="hover:text-gray-400"
                    icon="pi pi-plus"
                    :disabled="isLayerOnMap(result.uniqueIdentifier)"
                    :class="{
                        'cursor-default': isLayerOnMap(result.uniqueIdentifier),
                        'cursor-pointer': !isLayerOnMap(result.uniqueIdentifier),
                    }"
                    :data-cy="`add-result-${result.uniqueIdentifier}`"
                    @click="addToMap(result)"
                >
                </Button>
                <div
                    v-else
                    class="w-8"
                >
                    <!-- we need an empty element so the i button stays-->
                </div>
            </div>
        </div>
    </li>
</template>
