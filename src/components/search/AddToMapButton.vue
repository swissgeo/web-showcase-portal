<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { GeonetworkRecord } from '@/types/gnRecord'

import IconButton from '@/components/general/IconButton.vue'
import { defaultLayerOpacity } from '@/config/map.config'
import { useMainStore } from '@/store/main'
import { LayerType } from '@/types/layer'
import { getServiceResource } from '@/utils/layerUtils'

const { result } = defineProps<{
    result: GeonetworkRecord
}>()
const mainStore = useMainStore()
const { t } = useI18n()

const isLayerOnMap = computed(() => {
    return mainStore.isLayerOnMap(result.uniqueIdentifier)
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

    const info = isLayerOnMap.value ? t('searchResult.removeFromMap') : t('searchResult.addToMap')

    return `${info}\n\nUrl: ${url}\nName: ${name}`
})

const onClick = (record: GeonetworkRecord) => {
    if (isLayerOnMap.value) {
        removeFromMap(record)
    } else {
        addToMap(record)
    }
}

const addToMap = (record: GeonetworkRecord) => {
    mainStore.addLayerToMap({
        id: record.uniqueIdentifier,
        name: record.title,
        geonetworkRecord: record,
        opacity: defaultLayerOpacity,
        visible: true,
        type: LayerType.Geonetwork,
    })
}

const removeFromMap = (record: GeonetworkRecord) => {
    mainStore.deleteLayerById(record.uniqueIdentifier)
}
</script>

<template>
    <IconButton
        :severity="severity"
        :title="layerTooltipContent"
        class="cursor-pointer"
        :outlined="!isLayerOnMap"
        :data-cy="`add-result-${result.uniqueIdentifier}`"
        :icon="isLayerOnMap ? 'Check' : 'Plus'"
        @click="onClick(result)"
    >
    </IconButton>
</template>
