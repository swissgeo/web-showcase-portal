<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emits = defineEmits(['close', 'dontShowAgain'])

// Separate the temporary checkbox state from the persistent storage
const dontShowAgainCheckbox = ref(false)
const dontShowAgainStorage = useStorage('dontShowWelcomeOverlayAgain', false)

function handleClose() {
    // Only update localStorage if the user checked the box
    if (dontShowAgainCheckbox.value) {
        dontShowAgainStorage.value = true
        emits('dontShowAgain')
    } else {
        dontShowAgainStorage.value = false
        emits('close')
    }
}

function openExternalLink(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div
            class="relative mx-4 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-y-auto rounded-lg bg-white shadow-2xl"
        >
            <!-- Header -->
            <div class="border-b border-gray-200 px-6 py-4">
                <h1 class="text-2xl font-bold text-gray-900">
                    {{ t('welcomeOverlay.title') }}
                </h1>
            </div>

            <!-- Content -->
            <div class="flex-1 space-y-6 px-6 py-4">
                <!-- SWISSGEO Overview Section -->
                <section class="space-y-4">
                    <p class="leading-relaxed text-gray-700">
                        {{ t('welcomeOverlay.swissgeoOverview') }}
                    </p>
                    <p class="leading-relaxed text-gray-700">
                        {{ t('welcomeOverlay.additionalInfo') }}
                    </p>
                    <p class="leading-relaxed text-gray-700">
                        {{ t('welcomeOverlay.feedbackInfo') }}
                    </p>
                </section>
            </div>

            <!-- Footer -->
            <div class="border-t border-gray-200 px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <Checkbox
                            v-model="dontShowAgainCheckbox"
                            input-id="dontShowAgain"
                            binary
                        />
                        <label
                            for="dontShowAgain"
                            class="cursor-pointer text-sm text-gray-600"
                        >
                            {{ t('welcomeOverlay.dontShowAgain') }}
                        </label>
                    </div>
                    <div class="flex items-center space-x-3">
                        <Button
                            :label="t('welcomeOverlay.projectInfoLink')"
                            class="p-button-outlined"
                            icon="pi pi-info-circle"
                            @click="
                                openExternalLink(
                                    'https://www.geoinformation.ch/de/swissgeo-geoplattform'
                                )
                            "
                        />
                        <Button
                            data-cy="button-overlay-confirm"
                            :label="t('welcomeOverlay.confirm')"
                            icon="pi pi-arrow-right"
                            @click="handleClose"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
