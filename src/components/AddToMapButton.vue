<script setup lang="ts">
import Button from 'primevue/button'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { GeonetworkRecord } from '@/types/gnRecord'

import { useMainStore } from '@/store/main'
import { getServiceResource } from '@/utils/layerUtils'

const { result } = defineProps<{
    result: GeonetworkRecord
}>()

const mainStore = useMainStore()
const { t } = useI18n()

const isLayerOnMap = computed(() => {
    return mainStore.isLayerOnMap(result.uniqueIdentifier)
})

const icon = computed(() => {
    return isLayerOnMap.value ? 'pi pi-check' : 'pi pi-plus'
})

const severity = computed(() => {
    return isLayerOnMap.value ? 'success' : 'secondary'
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

    const info = t('searchResult.addToMap')

    return `${info}\n\nUrl: ${url}\nName: ${name}`
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
</script>

<template>
    <Button
        size="small"
        :severity="severity"
        :title="layerTooltipContent"
        class="hover:text-gray-400"
        :icon="icon"
        :disabled="isLayerOnMap"
        :class="{
            'cursor-default': isLayerOnMap,
            'cursor-pointer': !isLayerOnMap,
        }"
        :data-cy="`add-result-${result.uniqueIdentifier}`"
        @click="addToMap(result)"
    >
    </Button>
</template>
