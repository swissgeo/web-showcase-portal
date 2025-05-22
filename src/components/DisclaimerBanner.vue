<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
    <div
        class="translate fixed -top-2.5 right-[-175px] flex h-5 w-[350px] -translate-x-22 translate-y-22 rotate-45 items-center justify-center bg-red-600 text-sm font-bold text-white"
    >
        {{ t('disclaimer') }}
    </div>
</template>
