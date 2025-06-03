<script setup lang="ts">
import { computed } from 'vue'

import type { GeonetworkRecord } from '@/types/gnRecord'

import MapIcon from '@/assets/icons/map.svg?use'
import AddToMapButton from '@/components/search/AddToMapButton.vue'
import SearchResultEntry from '@/components/search/SearchResultEntry.vue'
import ShowLayerDetailButton from '@/components/search/ShowLayerDetailButton.vue'
import { isAddableToMap } from '@/utils/layerUtils'

const { result } = defineProps<{
    result: GeonetworkRecord
}>()

// provide some debug info
// this is for debugging purposes only and will go away after some time
const tooltipContent = computed(() => {
    const fullTitle = result.title || ''
    const owner = result.ownerOrganization?.name || ''

    return `${fullTitle}\n\n${owner}`
})
</script>

<template>
    <SearchResultEntry class="flex justify-end gap-2">
        <MapIcon class="h-4 w-4 overflow-hidden" />
        <div
            class="mr-auto flex-1 truncate"
            :title="tooltipContent"
        >
            {{ result.title }}
        </div>
        <ShowLayerDetailButton
            class="h-4 w-4 shrink-0"
            :layer-id="result.uniqueIdentifier"
        />
        <AddToMapButton
            v-if="isAddableToMap(result)"
            class="shrink-0"
            :result="result"
        />
        <div
            v-else
            class="w-10"
        >
            <!-- we need an empty element so the i button stays-->
        </div>
    </SearchResultEntry>
</template>
