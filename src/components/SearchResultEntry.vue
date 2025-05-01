<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'

import type { GeonetworkRecord } from '@/types/gnRecord'

import { useMainStore } from '@/store/main'
import { isAddableToMap } from '@/utils/layerUtils'

const mainStore = useMainStore()
const { isLayerOnMap } = storeToRefs(mainStore)

const { result } = defineProps<{
    result: GeonetworkRecord
}>()

const addToMap = (record: GeonetworkRecord) => {
    mainStore.addLayerToMap({
        id: record.uniqueIdentifier,
        name: record.title,
        geonetworkRecord: record,
    })
}

const showLayerInfo = (layerId: string) => {
    mainStore.setInfoLayerId(layerId)
}
</script>

<template>
    <li
        class="flex justify-between gap-4 py-1 mt-2 px-2 border border-gray-200 border-solid text-sm items-center"
        :class="{ 'text-gray-400': isLayerOnMap(result.uniqueIdentifier) }"
    >
        <div class="flex flex-col">
            <div class="">
                {{ result.title }}
            </div>
        </div>
        <div>
            <div class="flex gap-2">
                <Button
                    severity="secondary"
                    class="cursor-pointer hover:text-gray-400 mr-auto"
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
                    title="Add to map"
                    class="hover:text-gray-400"
                    icon="pi pi-plus"
                    :disabled="isLayerOnMap(result.uniqueIdentifier)"
                    :class="{
                        'cursor-default': isLayerOnMap(result.uniqueIdentifier),
                        'cursor-pointer': !isLayerOnMap(result.uniqueIdentifier),
                    }"
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
