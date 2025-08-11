<script setup lang="ts">
import { useDraggable, useElementBounding, useWindowSize } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import Accordion from 'primevue/accordion'
import Tab from 'primevue/tab'
import TabList from 'primevue/tablist'
import TabPanel from 'primevue/tabpanel'
import TabPanels from 'primevue/tabpanels'
import Tabs from 'primevue/tabs'
import { inject, ref, computed, onMounted, type Ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

import DatasetDetailPanel from '@/components/details/DatasetDetailPanel.vue'
import IconButton from '@/components/general/IconButton.vue'
import LucideIcon from '@/components/general/LucideIcon.vue'
import LayerLegendEntry from '@/components/LayerLegendEntry.vue'
import { useMainStore } from '@/store/main'
import { useUiStore } from '@/store/ui'

const uiStore = useUiStore()
const mainStore = useMainStore()
const { t } = useI18n()

const { showLayerInfo } = storeToRefs(mainStore)
const openedFromLayerDetailButton = computed(() => uiStore.openLayerWindowFromDetailButton)

const isDesktop = inject<Ref<boolean>>('isDesktop')

const activeTab = ref('legend')

const dragTarget = ref<HTMLElement | null>(null)
const dragHandle = ref<HTMLElement | null>(null)
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
const { x, y, isDragging } = useDraggable(dragTarget, {
    initialValue: uiStore.layerWindowLastPosition,
    handle: dragHandle,
})

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
        nextTick(() => {
            setPanelPosition()
        })
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
    legend: 'legend',
    detail: 'detail',
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
        return 'h-[10vh] w-[25vw] overflow-y-auto'
    }

    if (isDesktop?.value) {
        const constraints = panelSizeConstraints[tab]
        return `${constraints.h} ${constraints.w} overflow-y-auto`
    } else {
        return 'h-dvh w-full overflow-y-auto'
    }
}

onMounted(() => {
    setPanelPosition()
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

function setPanelPosition() {
    x.value =
        uiStore.layerWindowLastPosition.x < 0 ? centerX.value : uiStore.layerWindowLastPosition.x
    y.value =
        uiStore.layerWindowLastPosition.y < 0 ? centerY.value : uiStore.layerWindowLastPosition.y
}

watch(openedFromLayerDetailButton, (newValue) => {
    if (newValue) {
        activeTab.value = activeTabs.detail
    } else {
        activeTab.value = activeTabs.legend
    }
})

//clamp the panel to prevent it from going off-screen
watch([x, y, panelWidth, panelHeight], ([newX, newY]) => {
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
    if (!uiStore.isLayerWindowMaximized) {
        uiStore.setLayerWindowLastPosition(x.value, y.value)
    }
})
</script>

<template>
    <div
        ref="dragTarget"
        :style="isDesktop && !uiStore.isLayerWindowMaximized ? dragStyle : undefined"
        class="z-50 touch-none overflow-hidden"
        data-cy="comp-layer-window"
        :class="{
            // maximized desktop layout
            'absolute top-0 right-0 bottom-0 w-[480px] bg-white shadow-xl':
                isDesktop && uiStore.isLayerWindowMaximized,
            // rounded and border
            'rounded-xl border-2 border-[#1F576B]': isDesktop && !uiStore.isLayerWindowMaximized,
            // floating desktop layout
            absolute: isDesktop && !uiStore.isLayerWindowMaximized,
            // mobile layout
            'fixed right-0 bottom-0 left-0 flex h-dvh w-full flex-col place-content-between':
                !isDesktop,
        }"
    >
        <Tabs
            data-cy="comp-layer-window-tabs"
            :value="activeTab"
            :pt="{
                content: 'md:px-2',
                nav: 'bg-[#EBF1F3]',
                navContent: 'items-center flex gap-2',
            }"
        >
            <TabList
                ref="dragHandle"
                data-cy="comp-layer-window-tabslist"
                class="bg-[#EBF1F3]"
                :class="{
                    'cursor-move': isDesktop && !uiStore.isLayerWindowMaximized,
                    'select-none': isDragging, // Prevent text selection during dragging
                }"
            >
                <Tab
                    value="legend"
                    class="flex items-center border-t-1 border-r-1 border-b-1 border-[#B8CED6]"
                >
                    <LucideIcon
                        name="Shapes"
                        class="text-[#1C6B85]"
                    />
                    <span class="p-0.5 font-bold whitespace-nowrap text-[#1C6B85]">{{
                        t('legend.header')
                    }}</span>
                </Tab>
                <Tab
                    value="detail"
                    class="flex items-center border-t-1 border-r-1 border-b-1 border-[#B8CED6]"
                >
                    <LucideIcon
                        name="Info"
                        class="text-[#1C6B85]"
                    />
                    <span class="p-0.5 font-bold whitespace-nowrap text-[#1C6B85]">{{
                        t('details.header')
                    }}</span>
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel
                    value="legend"
                    data-cy="comp-layer-window-legend-tab"
                    :pt="{ header: 'border-1 border-[#B8CED6]' }"
                >
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
                    value="detail"
                    data-cy="comp-layer-window-details-tab"
                    :pt="{ header: 'border-1 border-[#B8CED6]' }"
                >
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
            </TabPanels>
        </Tabs>
        <div
            v-if="isDesktop"
            class="absolute top-2.5 right-2 z-10 flex flex-row items-center border-transparent bg-transparent"
        >
            <IconButton
                class="border-transparent bg-transparent"
                data-cy="comp-layer-window-maximize"
                :title="
                    uiStore.isLayerWindowMaximized
                        ? t('layerWindow.detachFromRight')
                        : t('layerWindow.attachToRight')
                "
                :icon="uiStore.isLayerWindowMaximized ? 'PanelRightOpen' : 'PanelRightClose'"
                icon-class="text-[#1C6B85]"
                @click="toggleMaximizedWindow"
            >
            </IconButton>
            <!-- Separator-->
            <div class="h-6 w-px bg-[#1C6B85] opacity-50" />
            <IconButton
                :text="isDesktop"
                class="bg-transparent"
                :size="'small'"
                :severity="'secondary'"
                data-cy="comp-layer-window-close"
                :title="t('layerWindow.close')"
                icon="X"
                icon-class="text-[#1C6B85]"
                @click="closeLayerWindow"
            >
            </IconButton>
        </div>
        <!-- Mobile close button -->
        <IconButton
            v-if="!isDesktop"
            :text="isDesktop"
            class="fixed bottom-4 left-4 z-50 flex items-center rounded-full bg-white shadow-md"
            :size="'large'"
            :severity="'secondary'"
            data-cy="comp-layer-window-close"
            :title="t('layerWindow.close')"
            icon="X"
            icon-class="h-5 w-5 text-[#1C6B85]"
            @click="closeLayerWindow"
        >
            <span class="text-sm font-medium"> {{ t('legend.closeThisWindow') }}</span>
        </IconButton>
    </div>
</template>

<style scoped>
:deep(.p-tablist-content .p-tablist-tab-list) {
    background: none;
}
</style>
