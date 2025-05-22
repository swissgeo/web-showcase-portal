<script lang="ts" setup>
import { List as ListIcon } from 'lucide-vue-next'
import Button from 'primevue/button'
import { computed } from 'vue'

import { useUiStore } from '@/store/ui'

const uiStore = useUiStore()

const severity = computed(() => {
    return uiStore.isLayerLegendVisible ? 'contrast' : 'secondary'
})

function toggleLayerLegend() {
    uiStore.toggleLayerLegend()
}
</script>

<template>
    <Button
        data-cy="comp-layer-legend-button"
        :severity="severity"
        outlined
        class="h-14 w-14 rounded-xl bg-white shadow hover:bg-neutral-100"
        @click="toggleLayerLegend"
    >
        <ListIcon class="h-5 w-5 text-black" />
    </Button>
</template>
