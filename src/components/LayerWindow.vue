<script setup lang="ts">
import { useDraggable, useElementBounding, useWindowSize } from '@vueuse/core'
import { PanelRightClose, PanelRightOpen, Info as InfoIcon, X, Shapes } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import Accordion from 'primevue/accordion'
import Button from 'primevue/button'
import TabPanel from 'primevue/tabpanel'
import TabView from 'primevue/tabview'
import { inject, ref, computed, onMounted, type Ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

import DatasetDetailPanel from '@/components/details/DatasetDetailPanel.vue'
import LayerLegendEntry from '@/components/LayerLegendEntry.vue'
import { useMainStore } from '@/store/main'
import { useUiStore } from '@/store/ui'

const uiStore = useUiStore()
const mainStore = useMainStore()
const { t } = useI18n()

const { showLayerInfo } = storeToRefs(mainStore)
const openedFromLayerDetailButton = computed(() => uiStore.openLayerWindowFromDetailButton)

const isDesktop = inject<Ref<boolean>>('isDesktop')

const activeTab = ref(0)

const dragTarget = ref<HTMLElement | null>(null)
const { width: panelWidth, height: panelHeight } = useElementBounding(dragTarget)
const { width: windowWidth, height: windowHeight } = useWindowSize()

//we divide by 2 and 5 to center the panel, such that it doesn't overlay
//the sidebar.
const centerX = computed(() => windowWidth.value / 2)
const centerY = computed(() => windowHeight.value / 5)

// at startup, we don't know the dimensions of the panel or the window,
// so we set initial values to -1000 to ensure the panel is off-screen
// and then we position it correctly after the next tick
// this is necessary to avoid flickering when the panel is first displayed
const { x, y } = useDraggable(dragTarget, {
    initialValue: {
        x: -1000,
        y: -1000,
    },
})

const centerPanel = () => {
    if (
        !isDesktop?.value &&
        uiStore.layerWindowLastPosition.x !== 0 &&
        uiStore.layerWindowLastPosition.y !== 0
    ) {
        return
    }

    x.value = centerX.value
    y.value = centerY.value
}

const movePanelToRight = () => {
    x.value = windowWidth.value - panelWidth.value
    y.value = 0
}

const toggleMaximizedWindow = () => {
    if (!isDesktop?.value) {
        return
    }

    if (uiStore.isLayerWindowMaximized) {
        uiStore.setMaximizedLayerWindow(false)
        centerPanel()
    } else {
        uiStore.setMaximizedLayerWindow(true)
        movePanelToRight()
    }
}

const closeLayerWindow = () => {
    uiStore.setLayerWindowVisible(false)
    uiStore.setOpenLayerWindowFromDetailButton(false)
    mainStore.resetInfoLayerId()
}

const activeTabs = {
    legend: 0,
    detail: 1,
}

// map of the three h and w combinations for various panel size constraints
const panelSizeConstraints = {
    legend: {
        h: 'h-[30vh]',
        w: 'w-[25vw]',
    },
    detail: {
        h: 'h-[60vh]',
        w: 'w-[30vw]',
    },
}

// we dynamically set size constraints depending on the tab/content and viewport
const determinePanelSize = (tab: 'detail' | 'legend'): string => {
    const isEmpty = {
        detail: !showLayerInfo.value,
        legend: !mainStore.layersOnMap.length,
    }

    const isMaximized = uiStore.isLayerWindowMaximized && isDesktop?.value

    if (isMaximized) {
        //IMPORTANT : Constrains tab content to manage overflow correctly
        return 'max-h-[90vh] overflow-y-auto'
    }

    if (isEmpty[tab] && isDesktop?.value) {
        return 'h-[10vh] w-[25vw] cursor-default overflow-y-auto'
    }

    if (isDesktop?.value) {
        const constraints = panelSizeConstraints[tab]
        return `${constraints.h} ${constraints.w} cursor-default overflow-y-auto`
    } else {
        return 'h-dvh w-full overflow-y-auto'
    }
}

onMounted(async () => {
    await nextTick() //wait for DOM to be fully rendered
    x.value = uiStore.layerWindowLastPosition.x || centerX.value
    y.value = uiStore.layerWindowLastPosition.y || centerY.value
})

const dragStyle = computed(() => {
    if (uiStore.isLayerWindowMaximized) {
        return {
            transform: `translate(${windowWidth.value - panelWidth.value}px, 0)`,
        }
    }

    return {
        transform: `translate(${x.value}px, ${y.value}px)`,
    }
})

watch(openedFromLayerDetailButton, (newValue) => {
    if (newValue) {
        activeTab.value = activeTabs.detail
        nextTick(() => {
            if (!uiStore.isLayerWindowMaximized) {
                centerPanel()
            }
        })
    } else {
        activeTab.value = activeTabs.legend
    }
})

//clamp the panel to prevent it from going off-screen
watch([x, y], () => {
    let newX = x.value
    let newY = y.value

    const maxX = windowWidth.value - panelWidth.value
    const maxY = windowHeight.value - panelHeight.value

    if (x.value < 0) newX = 0
    else if (x.value > maxX) newX = maxX

    if (y.value < 0) newY = 0
    else if (y.value > maxY) newY = maxY

    if (newX !== x.value || newY !== y.value) {
        x.value = newX
        y.value = newY
    }

    uiStore.setLayerWindowLastPosition(x.value, y.value)
})
</script>

<template>
    <div
        ref="dragTarget"
        :style="isDesktop && !uiStore.isLayerWindowMaximized ? dragStyle : undefined"
        class="z-50 touch-none"
        data-cy="comp-layer-window"
        :class="{
            // maximized desktop layout
            'absolute top-0 right-0 bottom-0 w-[480px] bg-white shadow-xl':
                isDesktop && uiStore.isLayerWindowMaximized,

            // floating desktop layout
            absolute: isDesktop && !uiStore.isLayerWindowMaximized,

            // mobile layout
            'fixed right-0 bottom-0 left-0 flex h-dvh w-full flex-col place-content-between':
                !isDesktop,
        }"
    >
        <TabView
            v-model:active-index="activeTab"
            data-cy="comp-layer-window-tabs"
            class="overflow-hidden"
            :class="{
                'cursor-move rounded-xl border-2 border-[#1F576B]':
                    isDesktop && !uiStore.isLayerWindowMaximized,
            }"
            :pt="{
                content: 'md:px-2',
                nav: 'bg-[#EBF1F3]',
                navContent: 'align-items-center flex gap-2',
            }"
        >
            <TabPanel
                value="legend"
                data-cy="comp-layer-window-legend-tab"
                :pt="{ header: 'border-1 border-[#B8CED6]' }"
            >
                <template #header>
                    <Shapes color="#1C6B85" />
                    <span class="p-0.5 font-bold whitespace-nowrap text-[#1C6B85]">{{
                        t('legend.header')
                    }}</span>
                </template>
                <div
                    data-cy="div-layer-legend"
                    :class="determinePanelSize('legend')"
                >
                    <Accordion v-if="mainStore.layersOnMap.length">
                        <LayerLegendEntry
                            v-for="layer in mainStore.visibleLayers"
                            :key="layer.id"
                            :layer="layer"
                        />
                    </Accordion>

                    <div
                        v-else
                        class="text-sm text-gray-600"
                    >
                        {{ t('legend.noLayers') }}
                    </div>
                </div>
            </TabPanel>

            <TabPanel
                value="details"
                data-cy="comp-layer-window-details-tab"
                :pt="{ header: 'border-1 border-[#B8CED6]' }"
            >
                <template #header>
                    <InfoIcon color="#1C6B85" />
                    <span class="p-0.5 font-bold whitespace-nowrap text-[#1C6B85]">{{
                        t('details.header')
                    }}</span>
                </template>
                <div
                    data-cy="div-layer-detail"
                    :class="determinePanelSize('detail')"
                >
                    <DatasetDetailPanel
                        v-if="showLayerInfo"
                        class="h-full w-full overflow-hidden"
                    />
                    <div
                        v-else
                        class="text-sm text-gray-600"
                    >
                        {{ t('layerCart.noLayerSelected') }}
                    </div>
                </div>
            </TabPanel>
            <!-- dummy tab panel to add padding for close button -->
            <TabPanel
                value="dummy"
                class="p-0"
                :disabled="true"
            >
                <div class="p-0" />
            </TabPanel>
        </TabView>

        <Button
            v-if="isDesktop"
            class="p-link absolute top-2.5 z-10 mr-1 cursor-pointer border-transparent bg-transparent"
            :class="[uiStore.isLayerWindowMaximized ? 'right-2' : 'right-10']"
            data-cy="comp-layer-window-maximize"
            @click="toggleMaximizedWindow"
        >
            <PanelRightClose
                v-if="!uiStore.isLayerWindowMaximized"
                color="#1C6B85"
            />
            <PanelRightOpen
                v-if="uiStore.isLayerWindowMaximized"
                color="#1C6B85"
            />
        </Button>
        <!-- Separator (only shown on desktop when not maximized) -->
        <div
            v-if="isDesktop && !uiStore.isLayerWindowMaximized"
            class="absolute top-5 right-[3rem] z-10 h-6 w-px bg-[#1C6B85] opacity-50"
        />
        <Button
            v-if="!uiStore.isLayerWindowMaximized"
            :text="isDesktop"
            :class="[
                isDesktop
                    ? 'absolute top-3 right-1 z-10 mr-1 cursor-pointer bg-transparent'
                    : 'fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-md',
            ]"
            :size="isDesktop ? 'small' : 'large'"
            :severity="'secondary'"
            data-cy="comp-layer-window-close"
            @click="closeLayerWindow"
        >
            <X
                color="#1C6B85"
                :class="isDesktop ? '' : 'h-5 w-5'"
            />
            <template v-if="!isDesktop">
                <span class="text-sm font-medium"> {{ t('legend.closeThisWindow') }}</span>
            </template>
        </Button>
    </div>
</template>
