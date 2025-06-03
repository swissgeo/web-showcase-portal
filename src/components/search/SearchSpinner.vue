<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner'

const { size = '100px' } = defineProps<{
    size?: string
}>()
</script>

<template>
    <div
        class="absolute top-0 right-0 bottom-0 left-0 z-2 flex h-full w-full items-center justify-center bg-white opacity-25"
    >
        <ProgressSpinner :style="{ width: size, height: size }" />
    </div>
</template>
