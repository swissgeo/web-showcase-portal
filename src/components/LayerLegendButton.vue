<script lang="ts" setup>
import Button from 'primevue/button'
import { computed } from 'vue'

import { useUiStore } from '@/store/ui'

const uiStore = useUiStore()

const severity = computed(() => {
    return uiStore.isLayerLegendVisible ? 'contrast' : 'primary'
})

function toggleLayerLegend() {
    uiStore.toggleLayerLegend()
}
</script>

<template>
    <Button
        :severity="severity"
        icon="pi pi-bars"
        @click="toggleLayerLegend"
    >
    </Button>
</template>
