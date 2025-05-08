<script setup lang="ts">
import Button from 'primevue/button'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { GeonetworkRecord } from '@/types/gnRecord'

import MapIcon from '@/assets/icons/map.svg?use'
import AddToMapButton from '@/components/AddToMapButton.vue'
import { useMainStore } from '@/store/main'
import { isAddableToMap } from '@/utils/layerUtils'

const { result } = defineProps<{
    result: GeonetworkRecord
}>()

const mainStore = useMainStore()
const { t } = useI18n()

// provide some debug info
// this is for debugging purposes only and will go away after some time
const tooltipContent = computed(() => {
    const fullTitle = result.title || ''
    const owner = result.ownerOrganization?.name || ''

    return `${fullTitle}\n\n${owner}`
})

const showLayerInfo = (layerId: string) => {
    mainStore.setInfoLayerId(layerId)
}
</script>

<template>
    <li
        class="mt-2 flex items-center justify-between gap-4 rounded border border-solid border-gray-100 px-2 py-1 text-sm"
    >
        <MapIcon class="h-4 w-4 shrink-0" />
        <div
            class="mr-auto truncate"
            :title="tooltipContent"
        >
            {{ result.title }}
        </div>
        <div>
            <div class="flex gap-2">
                <Button
                    severity="secondary"
                    class="mr-auto cursor-pointer hover:text-gray-400"
                    size="small"
                    icon="pi pi-info-circle"
                    :title="t('searchResult.showInfo')"
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
