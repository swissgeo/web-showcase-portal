<script lang="ts" setup>
import { computed } from 'vue'

import IconButton from '@/components/general/IconButton.vue'
import { useUiStore } from '@/store/ui'

const uiStore = useUiStore()

const severity = computed(() => {
    return uiStore.isLayerWindowVisible ? 'contrast' : 'secondary'
})

function toggleLayerWindow() {
    uiStore.toggleLayerWindow()
    uiStore.setOpenLayerWindowFromDetailButton(false)
}
</script>

<template>
    <IconButton
        data-cy="comp-layer-window-button"
        :severity="severity"
        text
        class="h-14 w-14 rounded-xl bg-white shadow hover:bg-neutral-50"
        icon="Shapes"
        icon-class="h-5 w-5"
        @click="toggleLayerWindow"
    >
    </IconButton>
</template>
