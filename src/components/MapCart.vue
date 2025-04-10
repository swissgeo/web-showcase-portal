<script setup>
import { useMainStore } from '@/store/main'

const mainstore = useMainStore()
</script>

<template>
  <div class="bg-white py-4 px-8 text-xl shadow-md">
    My Maps
    <div class="bg-red-400 text-white text-center inline-block rounded-full w-6">
      {{ mainstore.layersOnMap }}
    </div>
  </div>
</template>
