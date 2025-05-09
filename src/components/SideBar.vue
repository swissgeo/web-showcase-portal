<script lang="ts" setup>
import Button from 'primevue/button'

import LayerCartButton from '@/components/LayerCartButton.vue'
import LogoPic from '@/components/LogoPic.vue'
</script>

<template>
    <div class="z-10 flex w-16 flex-col items-center bg-neutral-100">
        <LogoPic
            condensed
            class="bg-white"
        />
        <LayerCartButton />
        <Button
            icon="pi pi-question"
            severity="secondary"
        />
    </div>
</template>
