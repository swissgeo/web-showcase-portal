<script setup lang="ts">
import { storeToRefs } from 'pinia'

import DatasetInfo from '@/components/DatasetInfo.vue'
import DesktopTitle from '@/components/DesktopTitle.vue'
import MapIntegration from '@/components/MapIntegration.vue'
import { useMainStore } from '@/store/main'

const mainStore = useMainStore()

const { showLayerInfo } = storeToRefs(mainStore)
</script>

<template>
    <div class="flex flex-col h-screen">
        <DesktopTitle class="hidden md:block"></DesktopTitle>
        <MapIntegration
            class="h-fit grow md:mt-16"
            :class="{ 'md:hidden': showLayerInfo }"
        ></MapIntegration>
        <DatasetInfo v-if="showLayerInfo" />
    </div>
</template>
