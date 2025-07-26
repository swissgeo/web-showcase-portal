<script setup lang="ts">
import { Info as InfoIcon } from 'lucide-vue-next'
import Button from 'primevue/button'
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'

import { PROJECT_INFO_URL } from '@/utils/constants'

const { t } = useI18n()
const isDesktop = inject<boolean>('isDesktop', true)

function openProjectInfo() {
    window.open(PROJECT_INFO_URL, '_blank', 'noopener,noreferrer')
}
</script>

<template>
    <Button
        severity="secondary"
        :outlined="!isDesktop"
        class="h-10"
        :class="{ 'h-14 w-14 rounded-xl bg-white': !isDesktop }"
        :title="t('welcomeOverlay.projectInfoLink')"
        @click="openProjectInfo"
    >
        <template #icon>
            <InfoIcon class="h-6 w-6 stroke-current" />
        </template>
    </Button>
</template>
