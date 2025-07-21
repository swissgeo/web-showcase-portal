<script setup lang="ts">
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

import DisclaimerBanner from '@/components/DisclaimerBanner.vue'
import LayerWindow from '@/components/LayerWindow.vue'
import LayerWindowButton from '@/components/LayerWindowButton.vue'
import MapPart from '@/components/MapPart.vue'
import SearchMobile from '@/components/search/SearchMobile.vue'
import SideBar from '@/components/SideBar.vue'
import WelcomeOverlay from '@/components/WelcomeOverlay.vue'
import { useWelcomeOverlay } from '@/composables/useWelcomeOverlay'
import { useUiStore } from '@/store/ui'

const uiStore = useUiStore()

const { isWelcomeOverlayVisible, initializeOverlay } = useWelcomeOverlay()
const resizeObserver: Ref<null | ResizeObserver> = ref(null)
const mainElem = useTemplateRef('main')
const windowWidth = ref(0)
const windowHeight = ref(0)

const isDesktop = computed(() => {
    // Consider desktop if width is over 1024px (typical breakpoint)
    return windowWidth.value > 1024
})

provide('isDesktop', readonly(isDesktop))

const fontSettings = computed(() => {
    const inter = 'Inter, ui sans serif'
    const geologica = 'Geologica'
    const dmSans = 'DM Sans'

    const params = new URL(window.location.href)
    const fontParam = params.searchParams.get('font')
    let font = inter
    if (fontParam === 'geologica') {
        font = geologica
    } else if (fontParam === 'dmsans') {
        font = dmSans
    }

    return { '--font-sans': font }
})

// provide a way to programmatically enable/disable the mobile and desktop
// versions of the search. Of course we could probably just have one component
// and do it all with CSS, but I'm sure this'll make things much more complicated
// just hiding/showing the components doesn't work either, as like this we'd have
// everything twice in the DOM. Makes e2e testing quite hard
function onResize(entries: ResizeObserverEntry[]) {
    if (entries && entries.length) {
        const entry = entries[0]
        const rect = entry.contentRect
        windowWidth.value = rect.width
        windowHeight.value = rect.height
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
        const rect = mainElem.value.getBoundingClientRect()
        windowWidth.value = rect.width
        windowHeight.value = rect.height
    }
}

onMounted(() => {
    // eslint-disable-next-line no-console
    console.log('HOME')
    addResizeListener()
    initializeWindowWidth()

    // Initialize welcome overlay based on user preference
    initializeOverlay()
})
onUnmounted(() => {
    removeResizeListener()
})
</script>

<template>
    <main
        ref="main"
        :style="fontSettings"
        class="font-sans"
    >
        <div
            class="relative h-screen"
            :class="{
                'flex flex-row justify-stretch': !isDesktop,
            }"
        >
            <SideBar v-if="isDesktop" />
            <DisclaimerBanner />
            <SearchMobile
                v-if="!isDesktop"
                class="pointer-events-auto"
                data-cy="comp-search-mobile"
            ></SearchMobile>
            <LayerWindow v-if="uiStore.isLayerWindowVisible" />
            <MapPart class="grow-1"></MapPart>
            <LayerWindowButton
                v-if="isDesktop && !uiStore.isLayerWindowVisible"
                class="pointer-events-auto absolute top-4 right-6"
            />
        </div>
        <WelcomeOverlay
            v-if="isWelcomeOverlayVisible"
            class="z-100"
        />
    </main>
</template>
