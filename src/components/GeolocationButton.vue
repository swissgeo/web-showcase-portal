<script setup lang="ts">
import Button from 'primevue/button'
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'

import { useMainStore } from '@/store/main'

const isDesktop = inject<boolean>('isDesktop', true)
const mainStore = useMainStore()
const { t } = useI18n()

const toggleGeolocation = () => {
    mainStore.setGeolocationEnabled(!mainStore.geolocationEnabled)
}
</script>

<template>
    <Button
        :severity="mainStore.geolocationEnabled ? 'primary' : 'secondary'"
        :outlined="!isDesktop"
        class="h-10"
        :class="{ 'h-14 w-14 rounded-xl bg-white': !isDesktop }"
        :title="mainStore.geolocationEnabled ? t('geolocation.disable') : t('geolocation.enable')"
        data-cy="geolocation-button"
        @click="toggleGeolocation"
    >
        <template #icon>
            <!-- Using PrimeVue's built-in location icon -->
            <i class="pi pi-map-marker h-6 w-6"></i>
        </template>
    </Button>
</template>
