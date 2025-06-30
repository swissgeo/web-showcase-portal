<script setup lang="ts">
import Button from 'primevue/button'
import { inject } from 'vue'

import SearchIcon from '@/assets/icons/search.svg?use'
import { SidebarType, useUiStore } from '@/store/ui'

const isDesktop = inject<boolean>('isDesktop')
// Access the store
const uiStore = useUiStore()

// Toggle visibility of the geocatalog tree
const toggleSearchPanel = () => {
    uiStore.toggleSidebar(SidebarType.SEARCH_PANEL)
}
</script>

<template>
    <div class="relative inline-block">
        <Button
            :severity="uiStore.isSearchPanelVisible ? 'primary' : 'secondary'"
            :outlined="!isDesktop"
            class="h-10"
            :class="{ 'h-14 w-14 rounded-xl bg-white': !isDesktop }"
            data-cy="button-geocatalog-tree"
            @click="toggleSearchPanel"
        >
            <template #icon>
                <SearchIcon class="h-6 w-6 stroke-current"></SearchIcon>
            </template>
        </Button>
    </div>
</template>
