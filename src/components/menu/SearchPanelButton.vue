<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import SidebarButton from '@/components/menu/SidebarButton.vue'
import { SidebarType, useUiStore } from '@/store/ui'

const { t } = useI18n()

const uiStore = useUiStore()
</script>

<template>
    <div class="relative inline-block">
        <SidebarButton
            :is-active="uiStore.isSearchVisible"
            data-cy="button-search-panel"
            :title="t('menu.search')"
            icon="Search"
            @click="uiStore.toggleSidebar(SidebarType.SEARCH)"
        >
        </SidebarButton>
    </div>
</template>
