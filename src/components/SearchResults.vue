<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'

import type { GeonetworkRecord } from '@/types/gnRecord'

import { useMainStore } from '@/store/main'
import { useSearchStore } from '@/store/search'

const searchStore = useSearchStore()
const mainStore = useMainStore()

const { isLayerOnMap } = storeToRefs(mainStore)

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

const isAddableToMap = (record: GeonetworkRecord) => {
    const onlineResources = record.onlineResources
    for (const res of onlineResources) {
        if (
            res.type === 'service' &&
            res.accessServiceProtocol &&
            ['wms', 'wmts'].includes(res.accessServiceProtocol)
        ) {
            return true
        }
    }
    return false
}
</script>

<template>
    <div class="overflow-hidden bg-white">
        <ul class="overflow-y-auto search-height-constrained md:max-h-auto">
            <li
                v-for="result in searchStore.searchResults"
                :key="result.uniqueIdentifier"
                class="flex justify-between gap-4"
                :class="{ 'text-gray-400': isLayerOnMap(result.uniqueIdentifier) }"
            >
                <div class="flex flex-col">
                    <div class="text-2xl">
                        {{ result.title }}
                    </div>
                    <div>Lorem ipsum dolor sit mappus geoadminus et geocatus</div>
                </div>
                <div>
                    <div class="flex gap-2">
                        <Button
                            class="cursor-pointer hover:text-gray-400"
                            icon="pi pi-info-circle"
                            title="Show info"
                            @click="showLayerInfo(result.id)"
                        >
                        </Button>
                        <Button
                            title="Add to map"
                            class="hover:text-gray-400"
                            icon="pi pi-plus"
                            :disabled="isLayerOnMap(result.id)"
                            :class="{
                                'cursor-default': isLayerOnMap(result.uniqueIdentifier),
                                'cursor-pointer': !isLayerOnMap(result.uniqueIdentifier),
                            }"
                            @click="addToMap(result)"
                        >
                        </Button>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
@reference "../assets/main.css";

li {
    @apply py-4 px-2;
    @apply border-b border-gray-200 border-solid;
}

.search-height-constrained {
    max-height: calc(100vh - 200px);
}
</style>
