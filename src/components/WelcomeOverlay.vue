<script setup lang="ts">
import Button from 'primevue/button'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emits = defineEmits(['close'])
</script>

<template>
    <div class="fixed w-full h-full inset-px opacity-50 bg-gray-200"></div>
    <div class="fixed w-full h-full inset-px flex items-center justify-center z-3">
        <div
            class="h-[90%] w-[90%] md:w-[66%] border border-solid border-black md:h-[66%] flex flex-col items-center bg-white justify-center gap-8 shadow-lg"
        >
            <div class="text-5xl">
                {{ t('welcomeOverlay.title') }}
            </div>
            <div>
                {{ t('welcomeOverlay.intro') }}
            </div>
            <div>
                <Button
                    :label="t('welcomeOverlay.confirm')"
                    @click="emits('close')"
                >
                </Button>
            </div>
        </div>
    </div>
</template>
