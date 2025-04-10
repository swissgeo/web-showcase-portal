<script setup>
import WelcomeOverlay from '@/components/WelcomeOverlay.vue'
import SearchPart from '@/components/SearchPart.vue'
import MapPart from '@/components/MapPart.vue'
import MapCart from '@/components/MapCart.vue'
import { ref } from 'vue'

const showWelcomeOverlay = ref(true)

const closeOverlay = () => {
  showWelcomeOverlay.value = false
}
</script>

<template>
  <main>
    <div class="md:flex md:gap-4">
      <SearchPart class="md:w-2/5"></SearchPart>
      <MapPart class="md:w-3/5"></MapPart>
    </div>
    <MapCart class="fixed right-0 bottom-0"></MapCart>
    <WelcomeOverlay class="z-100" v-if="showWelcomeOverlay" @close="closeOverlay"></WelcomeOverlay>
  </main>
</template>
