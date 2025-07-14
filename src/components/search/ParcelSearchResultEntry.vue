<script setup lang="ts">
import type { GeocodingResult } from '@geospatial-sdk/geocoding/lib/model'

import SearchResultEntry from '@/components/search/SearchResultEntry.vue'
import { getFirstCoordinate } from '@/search/mapUrlUtils'
import { useMapStore } from '@/store/map'

const { result } = defineProps<{
    result: GeocodingResult
}>()

const mapStore = useMapStore()

function selectParcel() {
    if (!result.geom) {
        return
    }
    const center = getFirstCoordinate(result.geom)

    mapStore.setMapUrlSearchParams({
        layers: mapStore.mapUrlSearchParams.layers,
        crosshair: 'marker',
        center,
        crossHairPosition: center,
        z: 12,
    })
}
</script>

<template>
    <SearchResultEntry @click="selectParcel">
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
