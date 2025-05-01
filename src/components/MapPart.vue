<script setup lang="ts">
import { storeToRefs } from 'pinia'

import DatasetInfo from '@/components/DatasetInfo.vue'
import MapIntegration from '@/components/MapIntegration.vue'
import { useMainStore } from '@/store/main'

const mainStore = useMainStore()

const { showLayerInfo } = storeToRefs(mainStore)
</script>

<template>
    <MapIntegration
        class="h-screen grow md:h-auto"
        :class="{ 'md:hidden': showLayerInfo }"
    ></MapIntegration>
    <DatasetInfo v-if="showLayerInfo" />
</template>
