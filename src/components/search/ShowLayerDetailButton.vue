<script setup lang="ts">
import { Info as InfoIcon } from 'lucide-vue-next'
import Button from 'primevue/button'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useMainStore } from '@/store/main'

const mainStore = useMainStore()
const { t } = useI18n()

const { layerId } = defineProps<{
    layerId: string
}>()

const showLayerInfo = (layerId: string) => {
    mainStore.setInfoLayerId(layerId)
}

const currentlyDisplayed = computed(() => {
    return mainStore.infoLayerId === layerId
})

const severity = computed(() => {
    return currentlyDisplayed.value ? 'primary' : 'secondary'
})

const variant = computed(() => {
    return currentlyDisplayed.value ? '' : 'text'
})
</script>

<template>
    <Button
        :data-cy="`button-show-layer-details-${layerId}`"
        :severity="severity"
        class="mr-auto cursor-pointer"
        :title="t('searchResult.showInfo')"
        :variant="variant"
        @click="showLayerInfo(layerId)"
    >
        <template #icon>
            <InfoIcon class="h-4 w-4" />
        </template>
    </Button>
</template>
