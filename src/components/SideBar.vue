<script lang="ts" setup>
import { useStorage } from '@vueuse/core'
import Button from 'primevue/button'

import LayerCart from '@/components/LayerCart.vue'
import LayerCartButton from '@/components/LayerCartButton.vue'
import LogoPic from '@/components/LogoPic.vue'
import { useUiStore } from '@/store/ui'

const showWelcomeOverlay = useStorage('showWelcomeOverlay', true)
const uiStore = useUiStore()

function showHelpOverlay() {
    showWelcomeOverlay.value = true
}
</script>

<template>
    <div class="absolute top-0 left-0 z-10 flex h-full w-auto flex-col bg-neutral-100 shadow-lg">
        <div class="bg-white">
            <LogoPic
                class="h-12"
                :condensed="!uiStore.isLayerCartVisible"
            />
        </div>
        <div class="flex h-full w-full flex-row p-0">
            <!-- First column -->
            <div class="flex min-w-16 flex-col items-center bg-neutral-100 pt-4">
                <LayerCartButton />
                <Button
                    icon="pi pi-question"
                    severity="secondary"
                    @click="showHelpOverlay"
                />
            </div>
            <!-- Second column -->
            <LayerCart
                v-show="uiStore.isLayerCartVisible"
                class="h-full w-[400px] bg-white"
            />
        </div>
    </div>
</template>
