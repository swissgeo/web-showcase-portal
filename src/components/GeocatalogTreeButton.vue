<script setup lang="ts">
import Button from 'primevue/button'
import { inject } from 'vue'

import LayerIcon from '@/assets/icons/layers.svg?use'
import { SidebarType, useUiStore } from '@/store/ui'

const isDesktop = inject<boolean>('isDesktop', true)
// Access the store
const uiStore = useUiStore()

// Toggle visibility of the geocatalog tree
const toggleGeocatalogTree = () => {
    uiStore.toggleSidebar(SidebarType.GEOCATALOG_TREE)
}
</script>

<template>
    <div class="relative inline-block">
        <Button
            :severity="uiStore.isGeocatalogTreeVisible ? 'primary' : 'secondary'"
            :outlined="!isDesktop"
            class="h-10"
            :class="{ 'h-14 w-14 rounded-xl bg-white': !isDesktop }"
            data-cy="button-geocatalog-tree"
            @click="toggleGeocatalogTree"
        >
            <template #icon>
                <LayerIcon class="h-6 w-6 stroke-current"></LayerIcon>
            </template>
        </Button>
    </div>
</template>
