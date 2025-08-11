<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import SidebarButton from '@/components/menu/SidebarButton.vue'

const { t } = useI18n()
import { getProjectInfoUrl } from '@/utils/constants'
import { useLanguage } from '@/utils/language.composable'

const { localeString } = useLanguage()

function openProjectInfo() {
    const projecInfoUrl = getProjectInfoUrl(localeString.value)
    window.open(projecInfoUrl, '_blank', 'noopener,noreferrer')
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
