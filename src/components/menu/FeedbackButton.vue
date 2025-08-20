<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import SidebarButton from '@/components/menu/SidebarButton.vue'

const { t } = useI18n()

function openProjectInfo() {
    const feedbackUrl = t('menu.feedbackLink')
    window.open(feedbackUrl, '_blank', 'noopener,noreferrer')
}
</script>

<template>
    <SidebarButton
        :is-active="false"
        :title="t('menu.feedback')"
        icon="MessageSquareHeart"
        @click="openProjectInfo"
    >
    </SidebarButton>
</template>
