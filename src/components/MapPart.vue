<script setup>
import MapIntegration from '@/components/MapIntegration.vue'
import DesktopTitle from '@/components/DesktopTitle.vue'
import DatasetInfo from '@/components/DatasetInfo.vue'
import { useMainStore } from '@/store/main'
import { storeToRefs } from 'pinia'

const mainStore = useMainStore()

const { showLayerInfo } = storeToRefs(mainStore)
</script>

<template>
  <div class="flex flex-col h-screen">
    <DesktopTitle class="hidden md:block"></DesktopTitle>
    <MapIntegration
      class="mt-24 h-fit grow md:mt-16"
      :class="{ 'md:hidden': showLayerInfo }"
    ></MapIntegration>
    <DatasetInfo v-if="showLayerInfo" />
  </div>
</template>
