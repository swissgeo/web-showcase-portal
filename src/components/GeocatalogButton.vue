<script setup lang="ts">
import Button from 'primevue/button'
import { inject } from 'vue'

import MapIcon from '@/assets/icons/map.svg?use'
import { useUiStore } from '@/store/ui'

const isDesktop = inject<boolean>('isDesktop')
// Access the store
const uiStore = useUiStore()

// Toggle visibility of the layer cart
const toggleGeocatalogTree = () => {
    uiStore.toggleGeocatalogTree()
}

</script>

<template>
    <div class="relative inline-block">
        <Button
            :severity="uiStore.isGeocatalogTreeVisible ? 'primary' : 'secondary'"
            :text="isDesktop"
            :outlined="!isDesktop"
            class="h-10"
            :class="{ 'h-14 w-14 rounded-xl bg-white': !isDesktop }"
            data-cy="button-layer-cart"
            @click="toggleGeocatalogTree"
        >
            <template #icon>
                <MapIcon class="h-6 w-6 stroke-current"></MapIcon>
            </template>
        </Button>
    </div>
</template>
