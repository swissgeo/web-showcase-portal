<script setup lang="ts">
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useMainStore } from '@/store/main'
import { useMapStore } from '@/store/map'
import { getCurrentPosition, type GeolocationError, isWithinSwissBounds } from '@/utils/geolocation'

const isDesktop = inject<boolean>('isDesktop', true)
const mainStore = useMainStore()
const mapStore = useMapStore()
const { t } = useI18n()
const toast = useToast()

const isGettingLocation = ref(false)

const toggleGeolocation = async () => {
    if (mainStore.geolocationEnabled) {
        // Disable geolocation
        mainStore.setGeolocationEnabled(false)
        return
    }

    // Enable geolocation and get current position
    isGettingLocation.value = true

    try {
        const position = await getCurrentPosition()
        const [x, y] = position.coordinates

        // Check if the position is within Swiss bounds
        if (!isWithinSwissBounds([x, y])) {
            toast.add({
                severity: 'warn',
                summary: t('geolocation.outsideSwissTerritory'),
                detail: t('geolocation.outsideSwissTerritoryDetail'),
                life: 5000,
                group: 'bc',
            })
        }
        // Set the map center and zoom to the user's location
        mainStore.setGeolocationEnabled(true)
        mapStore.setMapUrlSearchParams({
            center: [x, y],
            z: 10, // Good zoom level for location
        })

        // Enable geolocation in store

        toast.add({
            severity: 'success',
            summary: t('geolocation.locationFound'),
            detail: t('geolocation.locationFoundDetail', {
                accuracy: Math.round(position.accuracy),
            }),
            life: 3000,
            group: 'bc',
        })
    } catch (error) {
        const geoError = error as GeolocationError
        toast.add({
            severity: 'error',
            summary: t('geolocation.error'),
            detail: t('geolocation.errorDetail', { message: geoError.message }),
            life: 5000,
            group: 'bc',
        })
    } finally {
        isGettingLocation.value = false
    }
}
</script>

<template>
    <Button
        :severity="mainStore.geolocationEnabled ? 'primary' : 'secondary'"
        :outlined="!isDesktop"
        :loading="isGettingLocation"
        :disabled="isGettingLocation"
        class="h-10"
        :class="{ 'h-14 w-14 rounded-xl bg-white': !isDesktop }"
        :title="
            isGettingLocation
                ? t('geolocation.gettingLocation')
                : mainStore.geolocationEnabled
                  ? t('geolocation.disable')
                  : t('geolocation.enable')
        "
        data-cy="geolocation-button"
        @click="toggleGeolocation"
    >
        <template #icon>
            <i
                v-if="!isGettingLocation"
                class="pi pi-map-marker h-6 w-6"
            ></i>
        </template>
    </Button>
</template>
