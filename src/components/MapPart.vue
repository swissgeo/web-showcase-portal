<script setup>
import MapIntegration from '@/components/MapIntegration.vue'
import DesktopTitle from '@/components/DesktopTitle.vue'
</script>

<template>
  <div class="flex flex-col h-screen">
    <DesktopTitle class="hidden md:block"></DesktopTitle>
    <MapIntegration class="h-fit grow md:mt-16 mt-24"></MapIntegration>
  </div>
</template>
