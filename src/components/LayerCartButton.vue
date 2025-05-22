<script setup lang="ts">
import Button from 'primevue/button'
import { computed, inject } from 'vue'

import LayerIcon from '@/assets/icons/layers.svg?use'
import { useMainStore } from '@/store/main'
import { useUiStore } from '@/store/ui'

const isDesktop = inject<boolean>('isDesktop')

// Access the store
const mainStore = useMainStore()
const uiStore = useUiStore()

// Compute the number of layers on the map
const layerCount = computed(() => mainStore.layersOnMap.length)

// Toggle visibility of the layer cart
const toggleLayerCart = () => {
    uiStore.toggleLayerCart()
}
</script>

<template>
    <div class="relative inline-block">
        <Button
            :severity="uiStore.isLayerCartVisible ? 'primary' : 'secondary'"
            :text="isDesktop"
            :outlined="!isDesktop"
            class="h-10"
            :class="{ 'h-14 w-14 rounded-xl bg-white shadow': !isDesktop }"
            @click="toggleLayerCart"
        >
            <template #icon>
                <LayerIcon class="h-6 w-6 stroke-current"></LayerIcon>
            </template>
        </Button>
        <!-- Badge for layer count (not possible to use PrimeVue Badge with custon icon)-->
        <span
            v-if="layerCount"
            class="absolute top-0 right-0 flex h-5 w-5 translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-slate-600 text-xs font-bold text-white"
        >
            {{ layerCount }}
        </span>
    </div>
</template>
