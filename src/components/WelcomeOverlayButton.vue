<script setup lang="ts">
import Button from 'primevue/button'
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const isDesktop = inject<boolean>('isDesktop', true)

const emits = defineEmits(['showWelcomeOverlay'])

const showWelcomeOverlay = () => {
    emits('showWelcomeOverlay')
}
</script>

<template>
    <Button
        severity="secondary"
        :outlined="!isDesktop"
        class="h-10"
        :class="{ 'h-14 w-14 rounded-xl bg-white': !isDesktop }"
        data-cy="button-welcome-overlay"
        :title="t('welcomeOverlay.title')"
        @click="showWelcomeOverlay"
    >
        <template #icon>
            <i class="pi pi-question-circle text-xl"></i>
        </template>
    </Button>
</template>
