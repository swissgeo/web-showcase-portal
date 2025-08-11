<script setup lang="ts">
import Checkbox from 'primevue/checkbox'
import { useI18n } from 'vue-i18n'

import IconButton from '@/components/general/IconButton.vue'
import { useUiStore } from '@/store/ui'
import { getProjectInfoUrl } from '@/utils/constants'
import { useLanguage } from '@/utils/language.composable'

const { t } = useI18n()
const uiStore = useUiStore()
const { localeString } = useLanguage()

function handleClose() {
    // Handle the close action using the store
    if (uiStore.dontShowAgainCheckbox) {
        uiStore.hideWelcomeOverlayPermanently()
    } else {
        uiStore.hideWelcomeOverlay()
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
                <div class="flex items-center justify-between">
                    <h1 class="text-lg font-bold text-slate-950 sm:text-2xl">
                        {{ t('welcomeOverlay.title') }}
                    </h1>
                    <!-- SWISSGEO Logo -->
                    <div class="flex items-center">
                        <img
                            src="@/assets/images/swissgeo_rgb_icon.svg"
                            alt="SWISSGEO"
                            class="h-8 w-auto"
                        />
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div class="flex-1 space-y-6 px-6 py-4">
                <!-- SWISSGEO Overview Section -->
                <section class="space-y-4">
                    <p class="leading-relaxed text-slate-800">
                        {{ t('welcomeOverlay.swissgeoOverview') }}
                    </p>
                    <p class="leading-relaxed text-slate-800">
                        {{ t('welcomeOverlay.additionalInfo') }}
                    </p>
                    <p class="leading-relaxed text-slate-800">
                        {{ t('welcomeOverlay.feedbackInfo') }}
                    </p>
                </section>
            </div>

            <!-- Footer -->
            <div class="border-t border-gray-200 px-6 py-4">
                <div
                    class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
                >
                    <!-- Buttons -->
                    <div class="flex items-center space-x-3 sm:order-2">
                        <IconButton
                            :label="t('welcomeOverlay.moreInfos')"
                            class="p-button-outlined"
                            icon="ExternalLink"
                            icon-pos="right"
                            @click="openExternalLink(getProjectInfoUrl(localeString))"
                        />
                        <IconButton
                            data-cy="button-overlay-confirm"
                            :label="t('welcomeOverlay.startPrototype')"
                            icon="ArrowRight"
                            icon-pos="right"
                            @click="handleClose"
                        />
                    </div>
                    <!-- Checkbox -->
                    <div class="flex items-center space-x-2 sm:order-1">
                        <Checkbox
                            v-model="uiStore.dontShowAgainCheckbox"
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
                </div>
            </div>
        </div>
    </div>
</template>
