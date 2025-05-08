<script setup lang="ts">
import Button from 'primevue/button'
import { computed } from 'vue'

import type { GeonetworkRecord } from '@/types/gnRecord'

import AddToMapButton from '@/components/AddToMapButton.vue'
import { useMainStore } from '@/store/main'
import { isAddableToMap } from '@/utils/layerUtils'

const { result } = defineProps<{
    result: GeonetworkRecord
}>()

const mainStore = useMainStore()

// provide some debug info
// this is for debugging purposes only and will go away after some time
const tooltipContent = computed(() => {
    const owner = result.ownerOrganization?.name || ''
    const title = result.title || ''

    return `Owner: ${owner}\nTitle: ${title}`
})

const showLayerInfo = (layerId: string) => {
    mainStore.setInfoLayerId(layerId)
}
</script>

<template>
    <li
        class="mt-2 flex items-center justify-between gap-4 border border-solid border-gray-200 px-2 py-1 text-sm"
    >
        <div class="flex flex-col">
            <div
                class=""
                :title="tooltipContent"
            >
                {{ result.title }}
            </div>
        </div>
        <div>
            <div class="flex gap-2">
                <Button
                    severity="secondary"
                    class="mr-auto cursor-pointer hover:text-gray-400"
                    size="small"
                    icon="pi pi-info-circle"
                    title="Show info"
                    variant="text"
                    @click="showLayerInfo(result.uniqueIdentifier)"
                >
                </Button>
                <AddToMapButton
                    v-if="isAddableToMap(result)"
                    :result="result"
                />
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
