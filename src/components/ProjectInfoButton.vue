<script setup lang="ts">
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'

import IconButton from '@/components/general/IconButton.vue'
import { PROJECT_INFO_URL } from '@/utils/constants'

const { t } = useI18n()
const isDesktop = inject<boolean>('isDesktop', true)

function openProjectInfo() {
    window.open(PROJECT_INFO_URL, '_blank', 'noopener,noreferrer')
}
</script>

<template>
    <IconButton
        severity="secondary"
        :outlined="!isDesktop"
        class="h-10"
        :class="{ 'h-14 w-14 rounded-xl bg-white': !isDesktop }"
        :title="t('welcomeOverlay.projectInfoLink')"
        icon="Search"
        @click="openProjectInfo"
    >
    </IconButton>
</template>
