<script setup lang="ts">
import { computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

import IconButton from '@/components/general/IconButton.vue'
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

        // close the layer window if it is opened
        uiStore.setOpenLayerWindowFromDetailButton(false)
        uiStore.setLayerWindowVisible(false)
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
    <IconButton
        :data-cy="`button-show-layer-details-${layerId}`"
        :severity="severity"
        class="mr-auto cursor-pointer"
        :title="t('searchResult.showInfo')"
        :outlined="!currentlyDisplayed"
        icon="Info"
        icon-class="h-4 w-4"
        @click="showLayerInfo(layerId)"
    >
    </IconButton>
</template>
