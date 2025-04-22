<script setup lang="ts">
import { storeToRefs } from 'pinia'

import AddToMapIcon from '@/assets/icons/alternate-sign-out.svg?use'
import InfoIcon from '@/assets/icons/info.svg?use'
import { useMainStore } from '@/store/main'
import { useSearchStore, type Layer } from '@/store/search'

const searchStore = useSearchStore()
const mainStore = useMainStore()

const { isLayerOnMap } = storeToRefs(mainStore)

const addToMap = (layer: Layer) => {
    mainStore.addLayerToMap(layer)
}

const showLayerInfo = (layerId: string) => {
    mainStore.setInfoLayerId(layerId)
}
</script>

<template>
    <div class="overflow-hidden">
        <ul class="mt-8 overflow-y-auto search-height-constrained md:max-h-auto">
            <li
                v-for="result in searchStore.searchResults"
                :key="result.id"
                class="flex justify-between gap-4"
                :class="{ 'text-gray-400': isLayerOnMap(result.id) }"
            >
                <div class="flex flex-col">
                    <div class="text-2xl">
                        {{ result.name }}
                    </div>
                    <div>Lorem ipsum dolor sit mappus geoadminus et geocatus</div>
                </div>
                <div class="flex gap-2">
                    <button
                        title="Show info"
                        class="cursor-pointer hover:text-gray-400"
                        @click="showLayerInfo(result.id)"
                    >
                        <InfoIcon class="w-[32px] h-[32px]" />
                    </button>
                    <button
                        title="Add to map"
                        class="hover:text-gray-400"
                        :disabled="isLayerOnMap(result.id)"
                        :class="{
                            'cursor-default': isLayerOnMap(result.id),
                            'cursor-pointer': !isLayerOnMap(result.id),
                        }"
                        @click="addToMap(result)"
                    >
                        <AddToMapIcon class="w-[32px] h-[32px] rotate-90 md:rotate-none" />
                    </button>
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
