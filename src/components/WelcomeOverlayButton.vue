<script setup lang="ts">
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'

import IconButton from '@/components/general/IconButton.vue'

const { t } = useI18n()
const isDesktop = inject<boolean>('isDesktop', true)

const emits = defineEmits(['showWelcomeOverlay'])

const showWelcomeOverlay = () => {
    emits('showWelcomeOverlay')
}
</script>

<template>
    <IconButton
        severity="secondary"
        :outlined="!isDesktop"
        class="h-10"
        :class="{ 'h-14 w-14 rounded-xl bg-white': !isDesktop }"
        data-cy="button-welcome-overlay"
        :title="t('welcomeOverlay.title')"
        icon="CircleQuestionMark"
        @click="showWelcomeOverlay"
    >
    </IconButton>
</template>
