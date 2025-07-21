<script setup lang="ts">
import Button from 'primevue/button'
import { inject } from 'vue'

const isDesktop = inject<boolean>('isDesktop', true)

function openProjectInfo() {
    window.open(
        'https://www.geoinformation.ch/de/swissgeo-geoplattform',
        '_blank',
        'noopener,noreferrer'
    )
}
</script>

<template>
    <Button
        severity="secondary"
        :outlined="!isDesktop"
        class="h-10"
        :class="{ 'h-14 w-14 rounded-xl bg-white': !isDesktop }"
        title="Project Information"
        @click="openProjectInfo"
    >
        <template #icon>
            <i class="pi pi-info-circle text-xl"></i>
        </template>
    </Button>
</template>
