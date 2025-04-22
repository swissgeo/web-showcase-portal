<script setup lang="ts">
import { ref } from 'vue'

import MapCart from '@/components/LayerCart.vue'
import MapPart from '@/components/MapPart.vue'
import SearchPart from '@/components/SearchPart.vue'
import WelcomeOverlay from '@/components/WelcomeOverlay.vue'

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
        <MapCart></MapCart>
        <WelcomeOverlay
            v-if="showWelcomeOverlay"
            class="z-100"
            @close="closeOverlay"
        ></WelcomeOverlay>
    </main>
</template>
