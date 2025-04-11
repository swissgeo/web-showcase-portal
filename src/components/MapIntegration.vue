<script setup lang="ts">
import { computed } from 'vue'
import { useMainStore } from '@/store/main'

const mainStore = useMainStore()

const urlString = computed(() => {
  const baseUrl = 'https://map.geo.admin.ch/#embed'
  const searchParams = new URLSearchParams()

  searchParams.append('lang', 'de')
  searchParams.append('z', '1')
  searchParams.append('center', '2660000,1190000')
  searchParams.append('layers', mainStore.layersOnMap.map((layer) => layer.id).join(';'))
  searchParams.append('bgLayer', 'ch.swisstopo.pixelkarte-farbe')

  return `${baseUrl}/?${searchParams.toString()}`
})
</script>

<template>
  <iframe :src="urlString" class="w-full h-fit" allow="geolocation"></iframe>
</template>
