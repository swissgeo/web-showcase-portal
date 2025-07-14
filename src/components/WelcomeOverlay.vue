<script setup lang="ts">
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emits = defineEmits(['close', 'dontShowAgain'])

const dontShowAgain = ref(false)

function handleClose() {
    if (dontShowAgain.value) {
        emits('dontShowAgain')
    } else {
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
                        <button
                            class="inline-block text-blue-600 underline hover:text-blue-800 focus:outline-none"
                            @click="openExternalLink('https://sys-pwip.dev.bgdi.ch/')">{{ t('welcomeOverlay.hereLabel') }}</button>
                        {{ t('welcomeOverlay.swissgeoOverview').replace(t('welcomeOverlay.hereLabel'), '') }}
                    </p>
                    <p class="leading-relaxed text-gray-700">
                        {{ t('welcomeOverlay.additionalInfo') }}
                    </p>
                    <p class="leading-relaxed text-gray-700">
                        {{ t('welcomeOverlay.feedbackInfo') }}
                    </p>
                </section>

                <!-- Action Buttons Section -->
                <section class="space-y-3">
                    <Button
                        :label="t('welcomeOverlay.prototypeLink')"
                        class="w-full p-button-outlined"
                        icon="pi pi-external-link"
                        @click="openExternalLink('https://sys-pwip.dev.bgdi.ch/')"
                    />
                    <Button
                        :label="t('welcomeOverlay.projectInfoLink')"
                        class="w-full p-button-outlined p-button-secondary"
                        icon="pi pi-info-circle"
                        @click="openExternalLink('https://www.geoinformation.ch/de/swissgeo-geoplattform')"
                    />
                </section>
            </div>

            <!-- Footer -->
            <div class="border-t border-gray-200 px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <Checkbox
                            v-model="dontShowAgain"
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
</template>
