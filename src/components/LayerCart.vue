<script setup>
import { useMainStore } from '@/store/main'

const mainstore = useMainStore()
</script>

<template>
  <div class="bg-white py-4 px-8 text-xl layer-cart">
    My Maps
    <div class="bg-red-400 text-white text-center inline-block rounded-full w-6">
      {{ mainstore.layersOnMap }}
    </div>
  </div>
</template>

<style scoped>
.layer-cart {
  box-shadow: -5px -5px 10px 0px rgba(199, 199, 199, 1);
}
</style>
