<script setup lang="ts">
import { inject } from 'vue'

import IconButton from '@/components/general/IconButton.vue'
import { SidebarType, useUiStore } from '@/store/ui'

const isDesktop = inject<boolean>('isDesktop', true)
const uiStore = useUiStore()
</script>

<template>
    <div class="relative inline-block">
        <IconButton
            :severity="uiStore.isSearchVisible ? 'primary' : 'secondary'"
            :outlined="!isDesktop"
            class="h-10"
            :class="{ 'h-14 w-14 rounded-xl bg-white': !isDesktop }"
            data-cy="button-search-panel"
            icon="Search"
            @click="uiStore.toggleSidebar(SidebarType.SEARCH)"
        >
        </IconButton>
    </div>
</template>
