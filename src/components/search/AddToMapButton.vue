<script setup lang="ts">
import { Plus as PlusIcon, Check as CheckIcon } from 'lucide-vue-next'
import Button from 'primevue/button'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { TopicTreeNode } from '@/types/geocatalog'
import type { GeonetworkRecord } from '@/types/gnRecord'

import { useMainStore } from '@/store/main'
import { getServiceResource } from '@/utils/layerUtils'

const { result } = defineProps<{
    result: GeonetworkRecord | TopicTreeNode
}>()


const mainStore = useMainStore()
const { t } = useI18n()

function isGeonetworkRecord(obj: unknown): obj is GeonetworkRecord {
    return !!obj && typeof obj === 'object' && 'uniqueIdentifier' in obj;
}


const layerId = computed(() => {
    if (isGeonetworkRecord(result)){
        return result.uniqueIdentifier
    } else {
        return result.layerBodId
    }
})

const layerName = computed(() => {
    if (isGeonetworkRecord(result)){
        return result.title
    } else {
        return result.label
    }
})

const isLayerOnMap = computed(() => {
    return mainStore.isLayerOnMap(layerId.value)
})

const severity = computed(() => {
    return isLayerOnMap.value ? 'success' : 'secondary'
})

// provide some debug info on the wms/wmts service
// this is for debugging purposes only and will go away after some time
const layerTooltipContent = computed(() => {
    const info = t('searchResult.addToMap')

    if (isGeonetworkRecord(result)) {
        // GeonetworkRecord
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
        return `${info}\n\nUrl: ${url}\nName: ${name}`
    } else {
        //  TopicTreeNode
        return `${info}\n\nID: ${result.layerBodId}\nName: ${result.label}`
    }

})

const onClick = (record: GeonetworkRecord | TopicTreeNode) => {

    if (isLayerOnMap.value) {
        removeFromMap()
    } else {
        addToMap(record)
    }
}

const addToMap = (record: GeonetworkRecord | TopicTreeNode) => {
    mainStore.addLayerToMap({
        id: layerId.value,
        name: layerName.value,
        opacity: 1,
        visible: true,
        geonetworkRecord: isGeonetworkRecord(record) ? record : null
    })
}

const removeFromMap = () => {
    mainStore.deleteLayerById(layerId.value)
}
</script>

<template>
    <Button
        :severity="severity"
        :title="layerTooltipContent"
        class="cursor-pointer"
        :outlined="!isLayerOnMap"
        :data-cy="`add-result-${result.uniqueIdentifier}`"
        @click="onClick(result)"
    >
        <template #icon>
            <PlusIcon
                v-if="!isLayerOnMap"
                class="h-4 w-4"
            />
            <CheckIcon
                v-else
                class="h-4 w-4"
            />
        </template>
    </Button>
</template>
