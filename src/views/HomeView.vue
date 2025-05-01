<script setup lang="ts">
import { ref } from 'vue'

import MapPart from '@/components/MapPart.vue'
import SearchDesktop from '@/components/SearchDesktop.vue'
import SearchMobile from '@/components/SearchMobile.vue'
import WelcomeOverlay from '@/components/WelcomeOverlay.vue'

const showWelcomeOverlay = ref(true)

const closeOverlay = () => {
    showWelcomeOverlay.value = false
}
</script>

<template>
    <main>
        <div class="md:flex md:flex-col md:justify-stretch h-screen">
            <SearchMobile class="md:hidden"></SearchMobile>
            <SearchDesktop class="hidden md:flex"></SearchDesktop>
            <MapPart class="grow-1"></MapPart>
        </div>
        <WelcomeOverlay
            v-if="showWelcomeOverlay"
            class="z-100"
            @close="closeOverlay"
        ></WelcomeOverlay>
    </main>
</template>
