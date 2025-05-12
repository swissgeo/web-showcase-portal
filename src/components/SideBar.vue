<script lang="ts" setup>
import { useStorage } from '@vueuse/core'
import Button from 'primevue/button'

import LayerCartButton from '@/components/LayerCartButton.vue'
import LogoPic from '@/components/LogoPic.vue'

const showWelcomeOverlay = useStorage('showWelcomeOverlay', true)

function showHelpOverlay() {
    showWelcomeOverlay.value = true
}
</script>

<template>
    <div class="z-10 flex w-16 flex-col items-center bg-neutral-100">
        <LogoPic
            condensed
            class="bg-white"
        />
        <LayerCartButton />
        <!-- Help button -->
        <Button
            icon="pi pi-question"
            severity="secondary"
            @click="showHelpOverlay"
        />
    </div>
</template>
