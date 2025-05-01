<script setup lang="ts">
import Button from 'primevue/button'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emits = defineEmits(['close'])
</script>

<template>
    <div class="fixed inset-px h-full w-full bg-gray-200 opacity-50"></div>
    <div class="fixed inset-px z-3 flex h-full w-full items-center justify-center">
        <div
            class="flex h-[90%] w-[90%] flex-col items-center justify-center gap-8 border border-solid border-black bg-white shadow-lg md:h-[66%] md:w-[66%]"
        >
            <div class="text-5xl">
                {{ t('welcomeOverlay.title') }}
            </div>
            <div>
                {{ t('welcomeOverlay.intro') }}
            </div>
            <div>
                <Button
                    data-cy="button-overlay-confirm"
                    :label="t('welcomeOverlay.confirm')"
                    @click="emits('close')"
                >
                </Button>
            </div>
        </div>
    </div>
</template>
