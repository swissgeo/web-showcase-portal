<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import SidebarButton from '@/components/menu/SidebarButton.vue'
import { SidebarType, useUiStore } from '@/store/ui'

const { t } = useI18n()

// Access the store
const uiStore = useUiStore()

// Toggle visibility of the geocatalog tree
const toggleGeocatalogTree = () => {
    uiStore.toggleSidebar(SidebarType.GEOCATALOG_TREE)
}
</script>

<template>
    <SidebarButton
        :title="t('menu.geocatalog')"
        :is-active="uiStore.isGeocatalogTreeVisible"
        data-cy="button-geocatalog-tree"
        icon="Layers3"
        @click="toggleGeocatalogTree"
    >
    </SidebarButton>
</template>
