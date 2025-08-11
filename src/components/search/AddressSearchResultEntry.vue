<script setup lang="ts">
import type { GeocodingResult } from '@geospatial-sdk/geocoding/lib/model'

import LucideIcon from '@/components/general/LucideIcon.vue'
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
        crossHairPosition: firstCoordinate,
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
            <LucideIcon
                name="MapPin"
                class="h-5 w-5"
            />
            <div class="truncate">
                {{ result?.label }}
            </div>
        </div>
    </SearchResultEntry>
</template>
