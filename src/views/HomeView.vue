<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

import MapPart from '@/components/MapPart.vue'
import SearchDesktop from '@/components/SearchDesktop.vue'
import SearchMobile from '@/components/SearchMobile.vue'
import WelcomeOverlay from '@/components/WelcomeOverlay.vue'
import useBreakpoints from '@/utils/breakpoints'

const showWelcomeOverlay = ref(true)
const windowWidth = ref(0)

const { breakpoints } = useBreakpoints()

const isDesktop = computed(() => windowWidth.value >= breakpoints.value.md)

function closeOverlay() {
    showWelcomeOverlay.value = false
}

// provide a way to programmatically enable/disable the mobile and desktop
// versions of the search. Of course we could probably just have one component
// and do it all with CSS, but I'm sure this'll make things much more complicated
// just hiding/showing the components doesn't work either, as like this we'd have
// everything twice in the DOM. Makes e2e testing quite hard
function onResize() {
    windowWidth.value = window.innerWidth
}

function addResizeListener() {
    window.addEventListener('resize', onResize)
}

function removeResizeListener() {
    window.addEventListener('resize', onResize)
}

onMounted(() => {
    addResizeListener()
    // we need to trigger it once
    onResize()
})
onUnmounted(() => {
    removeResizeListener()
})
</script>

<template>
    <main>
        <div class="md:flex md:flex-col md:justify-stretch h-screen">
            <SearchMobile
                v-if="!isDesktop"
                data-cy="comp-search-mobile"
            ></SearchMobile>
            <SearchDesktop
                v-if="isDesktop"
                data-cy="comp-search-desktop"
                class="flex"
            ></SearchDesktop>
            <MapPart class="grow-1"></MapPart>
        </div>
        <WelcomeOverlay
            v-if="showWelcomeOverlay"
            class="z-100"
            @close="closeOverlay"
        ></WelcomeOverlay>
    </main>
</template>
