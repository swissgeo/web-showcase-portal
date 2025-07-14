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
                <section>
                    <p class="mb-4 leading-relaxed text-gray-700">
                        {{ t('welcomeOverlay.swissgeoOverview') }}
                    </p>
                    <Button
                        :label="t('welcomeOverlay.swissgeoLink')"
                        class="p-button-outlined"
                        icon="pi pi-external-link"
                        @click="openExternalLink('https://www.geo.admin.ch/')"
                    />
                </section>

                <!-- Previous Version Section -->
                <section class="rounded-lg bg-blue-50 p-4">
                    <h3 class="mb-2 text-lg font-semibold text-blue-900">
                        {{ t('welcomeOverlay.previousVersionTitle') }}
                    </h3>
                    <p class="mb-3 text-blue-800">
                        {{ t('welcomeOverlay.previousVersionInfo') }}
                    </p>
                    <Button
                        :label="t('welcomeOverlay.previousVersionLink')"
                        class="p-button-outlined p-button-info"
                        icon="pi pi-history"
                        @click="openExternalLink('https://map.geo.admin.ch/')"
                    />
                </section>

                <!-- Feedback Section -->
                <section class="rounded-lg bg-green-50 p-4">
                    <h3 class="mb-2 text-lg font-semibold text-green-900">
                        {{ t('welcomeOverlay.feedbackTitle') }}
                    </h3>
                    <p class="mb-3 text-green-800">
                        {{ t('welcomeOverlay.feedbackInfo') }}
                    </p>
                    <Button
                        :label="t('welcomeOverlay.feedbackLink')"
                        class="p-button-outlined p-button-success"
                        icon="pi pi-comment"
                        @click="
                            openExternalLink('mailto:webgis@swisstopo.ch?subject=PWIP Feedback')
                        "
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
