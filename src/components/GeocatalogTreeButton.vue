<script setup lang="ts">
import { inject } from 'vue'

import IconButton from '@/components/general/IconButton.vue'
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
        <IconButton
            :severity="uiStore.isGeocatalogTreeVisible ? 'primary' : 'secondary'"
            :outlined="!isDesktop"
            class="h-10"
            :class="{ 'h-14 w-14 rounded-xl bg-white': !isDesktop }"
            data-cy="button-geocatalog-tree"
            icon="Layers"
            @click="toggleGeocatalogTree"
        >
        </IconButton>
    </div>
</template>
