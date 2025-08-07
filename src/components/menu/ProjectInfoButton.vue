<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import SidebarButton from '@/components/menu/SidebarButton.vue'

const { t } = useI18n()
import { PROJECT_INFO_URL } from '@/utils/constants'

function openProjectInfo() {
    window.open(PROJECT_INFO_URL, '_blank', 'noopener,noreferrer')
}
</script>

<template>
    <SidebarButton
        :is-active="false"
        :title="t('menu.projectInfo')"
        icon="CircleHelp"
        @click="openProjectInfo"
    >
    </SidebarButton>
</template>
