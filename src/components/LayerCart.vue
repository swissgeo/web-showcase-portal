<script setup lang="ts">
import { useMainStore } from '@/store/main'

const mainstore = useMainStore()
</script>

<template>
  <div class="px-8 py-4 text-xl bg-white layer-cart">
    My Maps
    <div class="inline-block w-6 text-center text-white bg-red-400 rounded-full">
      {{ mainstore.layersOnMapCount }}
    </div>
  </div>
</template>

<style scoped>
.layer-cart {
  box-shadow: -5px -5px 10px 0px rgba(199, 199, 199, 1);
}
</style>
