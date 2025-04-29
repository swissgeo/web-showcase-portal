<script lang="ts" setup>
import Button from 'primevue/button'

import LayerCartButton from '@/components/LayerCartButton.vue'
import LogoPic from '@/components/LogoPic.vue'
</script>

<template>
    <div class="flex flex-col bg-neutral-100 w-16 items-center">
        <LogoPic
            condensed
            class="bg-white p-2"
        />
        <LayerCartButton />
        <Button
            icon="pi pi-question"
            severity="secondary"
        />
    </div>
</template>
