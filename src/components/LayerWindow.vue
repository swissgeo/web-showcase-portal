<script setup lang="ts">
import { useDraggable, useElementBounding, useWindowSize } from '@vueuse/core'
import { Info, List, X, Shapes } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import Accordion from 'primevue/accordion'
import Button from 'primevue/button'
import TabPanel from 'primevue/tabpanel'
import TabView from 'primevue/tabview'
import { inject, ref, computed, onMounted, type Ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

import DatasetDetailPanel from '@/components/details/DatasetDetailPanel.vue'
import DatasetInfoSection from '@/components/details/DatasetInfoSection.vue'
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
    if (isDesktop?.value) {
        return
    }
    x.value = windowWidth.value / 4
    y.value = windowHeight.value / 4
}

const closeLayerWindow = () => {
    uiStore.setLayerWindowVisible(false)
    uiStore.setOpenLayerWindowFromDetailButton(false)
    mainStore.resetInfoLayerId()
}

onMounted(() => {
    setTimeout(() => {
        x.value = windowWidth.value - panelWidth.value - 20 //padding
        y.value = windowHeight.value - panelHeight.value - 20
    }, 0)
})

const dragStyle = computed(() => ({
    transform: `translate(${x.value}px, ${y.value}px)`,
}))

watch(openedFromLayerDetailButton, (newValue) => {
    if (newValue) {
        activeTab.value = 1 // switch to details tab if opened from layer detail button
        nextTick(() => {
            centerPanel()
        })
    } else {
        activeTab.value = 0 // switch back to legend tab
    }
})
</script>

<template>
    <div
        ref="dragTarget"
        :style="isDesktop ? dragStyle : undefined"
        class="z-50 cursor-move touch-none"
        data-cy="comp-layer-window"
        :class="{
            absolute: isDesktop,
            'fixed right-0 bottom-0 left-0 flex h-dvh w-full flex-col place-content-between':
                !isDesktop,
        }"
    >
        <div class="relative">
            <TabView
                v-model:active-index="activeTab"
                data-cy="comp-layer-window-tabs"
                class="relative overflow-x-hidden overflow-y-auto rounded-xl shadow-md"
                :class="{
                    'border-2 border-[#1F576B]': isDesktop,
                }"
                :pt="{
                    content: 'md:px-2',
                    title: 'md:order-2',
                    nav: 'bg-[#EBF1F3]',
                    navContent: 'align-items-center flex gap-2',
                }"
            >
                <TabPanel
                    value="legend"
                    data-cy="comp-layer-window-legend-tab"
                >
                    <template #header>
                        <Shapes />
                        <span class="white-space-nowrap p-0.5 font-bold">{{
                            t('legend.header')
                        }}</span>
                    </template>
                    <div
                        data-cy="div-layer-legend"
                        class="overflow-y-auto px-4"
                        :class="
                            !mainStore.layersOnMap.length
                                ? 'h-[100px] w-[400px]'
                                : isDesktop
                                  ? 'h-[300px] w-[350px]'
                                  : 'h-dvh w-full'
                        "
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
                    @click="console.error('TabPanel clicked')"
                >
                    <template #header>
                        <List />
                        <span class="white-space-nowrap p-0.5 font-bold">{{
                            t('details.header')
                        }}</span>
                    </template>
                    <div
                        class="overflow-y-auto px-4"
                        :class="
                            !showLayerInfo
                                ? 'h-[100px] w-[400px]'
                                : isDesktop
                                  ? 'h-[600px] w-[600px]'
                                  : 'h-dvh w-full'
                        "
                    >
                        <DatasetDetailPanel v-if="showLayerInfo" />
                        <div
                            v-else
                            class="text-sm text-gray-600"
                        >
                            {{ t('layerCart.noLayerSelected') }}
                        </div>
                    </div>
                </TabPanel>

                <TabPanel
                    value="info"
                    data-cy="comp-layer-window-info-tab"
                >
                    <template #header>
                        <Info />
                        <span class="truncate p-0.5 font-bold">{{ t('details.info') }}</span>
                    </template>
                    <div
                        class="overflow-y-auto px-4"
                        :class="
                            !mainStore.infoLayerRecord
                                ? 'h-[100px] w-[400px]'
                                : isDesktop
                                  ? 'h-[300px] w-[600px]'
                                  : 'h-dvh w-full'
                        "
                    >
                        <DatasetInfoSection
                            v-if="mainStore.infoLayerRecord"
                            :info="mainStore.infoLayerRecord"
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
                :text="isDesktop"
                :class="[
                    isDesktop
                        ? 'p-panel-header-icon p-link absolute top-3 right-1 z-10 mr-1 cursor-pointer'
                        : 'fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-md',
                ]"
                :size="isDesktop ? 'small' : 'large'"
                :severity="'secondary'"
                data-cy="comp-layer-window-close"
                @click="closeLayerWindow"
            >
                <X :class="isDesktop ? '' : 'h-5 w-5'" />
                <template v-if="!isDesktop">
                    <span class="text-sm font-medium"> {{ t('legend.closeThisWindow') }}</span>
                </template>
            </Button>
        </div>
    </div>
</template>

<style scoped>
.p-tabview-selected {
    background-color: #b8ced6;
}
</style>
