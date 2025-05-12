<script setup lang="ts">
import type { GeocodingResult } from '@geospatial-sdk/geocoding/lib/model'

import SearchResultEntry from '@/components/search/SearchResultEntry.vue'
import { getFirstCoordinate } from '@/search/mapUrlUtils'
import { useMapStore } from '@/store/map'

const { result } = defineProps<{
    result: GeocodingResult
}>()

const mapStore = useMapStore()

function selectAddress() {
    if (!result.geom) {
        return
    }
    const firstCoordinate = getFirstCoordinate(result.geom)
    mapStore.setMapUrlSearchParams({
        crosshair: 'marker',
        center: firstCoordinate,
        z: 10,
    })
}
</script>

<template>
    <SearchResultEntry @click="selectAddress">
        <div
            class="flex w-full items-center justify-start gap-2"
            :title="result?.label"
        >
            <i class="pi pi-map-marker"></i>
            <div class="truncate">
                {{ result?.label }}
            </div>
        </div>
    </SearchResultEntry>
</template>
