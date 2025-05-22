<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import {
    computed,
    provide,
    onMounted,
    onUnmounted,
    ref,
    useTemplateRef,
    type Ref,
    readonly,
} from 'vue'

import DatasetDetailPanel from '@/components/details/DatasetDetailPanel.vue'
import LayerLegend from '@/components/LayerLegend.vue'
import MapPart from '@/components/MapPart.vue'
import SearchDesktop from '@/components/search/SearchDesktop.vue'
import SearchMobile from '@/components/search/SearchMobile.vue'
import SideBar from '@/components/SideBar.vue'
import WelcomeOverlay from '@/components/WelcomeOverlay.vue'
import { useMainStore } from '@/store/main'
import { useUiStore } from '@/store/ui'
import useBreakpoints from '@/utils/breakpoints'

const mainStore = useMainStore()
const { breakpoints } = useBreakpoints()

const { showLayerInfo } = storeToRefs(mainStore)
const uiStore = useUiStore()
const resizeObserver: Ref<null | ResizeObserver> = ref(null)
const showWelcomeOverlay = useStorage('showWelcomeOverlay', false)
const mainElem = useTemplateRef('main')
const windowWidth = ref(0)

const isDesktop = computed(() => windowWidth.value >= breakpoints.value.md)
provide('isDesktop', readonly(isDesktop))

function closeOverlay() {
    showWelcomeOverlay.value = false
}

// provide a way to programmatically enable/disable the mobile and desktop
// versions of the search. Of course we could probably just have one component
// and do it all with CSS, but I'm sure this'll make things much more complicated
// just hiding/showing the components doesn't work either, as like this we'd have
// everything twice in the DOM. Makes e2e testing quite hard
function onResize(entries: ResizeObserverEntry[]) {
    if (entries && entries.length) {
        const entry = entries[0]
        windowWidth.value = entry.contentRect.width
    }
}

function addResizeListener() {
    resizeObserver.value = new ResizeObserver(onResize)
    if (mainElem.value) {
        resizeObserver.value.observe(mainElem.value)
    }
}

function removeResizeListener() {
    if (resizeObserver.value && mainElem.value) {
        resizeObserver.value.unobserve(mainElem.value)
    }
}

function initializeWindowWidth() {
    if (mainElem.value) {
        windowWidth.value = mainElem.value.scrollWidth
    }
}

onMounted(() => {
    addResizeListener()
    initializeWindowWidth()
})
onUnmounted(() => {
    removeResizeListener()
})
</script>

<template>
    <main ref="main">
        <div class="relative h-screen md:flex md:flex-row md:justify-stretch">
            <SideBar v-if="isDesktop" />
            <SearchMobile
                v-if="!isDesktop"
                data-cy="comp-search-mobile"
            ></SearchMobile>
            <!-- This data-cy is not visible due to the overlay div inside -->
            <SearchDesktop
                v-if="isDesktop"
                data-cy="comp-search-desktop"
                class="flex"
            ></SearchDesktop>
            <LayerLegend v-if="uiStore.isLayerLegendVisible" />
            <MapPart class="grow-1"></MapPart>
            <DatasetDetailPanel v-if="showLayerInfo" />
        </div>
        <WelcomeOverlay
            v-if="showWelcomeOverlay"
            class="z-100"
            @close="closeOverlay"
        ></WelcomeOverlay>
    </main>
</template>
