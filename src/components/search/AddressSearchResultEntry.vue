<script setup lang="ts">
import type { GeocodingResult } from '@geospatial-sdk/geocoding/lib/model'

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
    <li
        class="flex cursor-pointer items-center gap-3 border-t-1 border-gray-200 px-4 py-4 text-sm"
        @click="selectAddress"
    >
        <i class="pi pi-map-marker"></i>
        <p>{{ result?.label }}</p>
    </li>
</template>
