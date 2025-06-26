<script setup lang="ts">
import { Info as InfoIcon } from 'lucide-vue-next'
import Button from 'primevue/button'
import { computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

import { useMainStore } from '@/store/main'
import { useUiStore } from '@/store/ui'
const uiStore = useUiStore()

const mainStore = useMainStore()
const { t } = useI18n()

const { layerId } = defineProps<{
    layerId: string
}>()

const showLayerInfo = (layerId: string) => {
    // If the layer is already displayed, hide it by setting infoLayerId to null
    if (layerId === mainStore.infoLayerId) {
        mainStore.resetInfoLayerId()
    } else {
        mainStore.setInfoLayerId(layerId)

        // Ensure watcher triggers by resetting then setting
        uiStore.setOpenLayerWindowFromDetailButton(false)
        nextTick(() => {
            uiStore.setOpenLayerWindowFromDetailButton(true)
        })

        uiStore.setLayerWindowVisible(true)
    }
}

const currentlyDisplayed = computed(() => {
    return mainStore.infoLayerId === layerId
})

const severity = computed(() => {
    return currentlyDisplayed.value ? 'primary' : 'secondary'
})
</script>

<template>
    <Button
        :data-cy="`button-show-layer-details-${layerId}`"
        :severity="severity"
        class="mr-auto cursor-pointer"
        :title="t('searchResult.showInfo')"
        :outlined="!currentlyDisplayed"
        @click="showLayerInfo(layerId)"
    >
        <template #icon>
            <InfoIcon class="h-4 w-4" />
        </template>
    </Button>
</template>
