<script setup lang="ts">
import Button from 'primevue/button'
import { inject } from 'vue'

import SearchIcon from '@/assets/icons/search.svg?use'
import { SidebarType, useUiStore } from '@/store/ui'

const isDesktop = inject<boolean>('isDesktop')
// Access the store
const uiStore = useUiStore()
</script>

<template>
    <div class="relative inline-block">
        <Button
            :severity="uiStore.isSearchVisible ? 'primary' : 'secondary'"
            :outlined="!isDesktop"
            class="h-10"
            :class="{ 'h-14 w-14 rounded-xl bg-white': !isDesktop }"
            data-cy="button-search-panel"
            @click="uiStore.toggleSidebar(SidebarType.SEARCH)"
        >
            <template #icon>
                <SearchIcon class="h-6 w-6 stroke-current"></SearchIcon>
            </template>
        </Button>
    </div>
</template>
