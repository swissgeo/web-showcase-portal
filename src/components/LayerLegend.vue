<script setup lang="ts">
import { PanelRightClose } from 'lucide-vue-next'
import Accordion from 'primevue/accordion'
import Button from 'primevue/button'
import Panel from 'primevue/panel'
import ScrollPanel from 'primevue/scrollpanel'
import { inject, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'

import LayerLegendEntry from '@/components/LayerLegendEntry.vue'
import { useMainStore } from '@/store/main'
import { useUiStore } from '@/store/ui'

const isDesktop = inject<Ref<boolean>>('isDesktop')

const uiStore = useUiStore()
const mainStore = useMainStore()
const { t } = useI18n()
</script>

<template>
    <div data-cy="div-layer-legend">
        <Panel
            :header="t('legend.header')"
            class="fixed right-0 bottom-0 left-0 z-10 h-1/2 md:top-4 md:right-4 md:bottom-auto md:left-auto md:h-[380px]"
            :pt="{
                content: 'md:px-2',
                title: 'md:order-2',
                headerActions: 'md:order-1',
                header: 'md:justify-start md:px-2',
            }"
        >
            <template #icons>
                <Button
                    :text="true"
                    class="p-panel-header-icon p-link mr-1 cursor-pointer"
                    size="small"
                    severity="secondary"
                    data-cy="comp-layer-legend-close"
                    @click="uiStore.setLayerLegendVisible(false)"
                >
                    <PanelRightClose v-if="isDesktop" />
                    <i
                        v-else
                        class="pi pi-times"
                    />
                </Button>
            </template>
            <ScrollPanel class="h-[300px] md:w-[300px]">
                <Accordion v-if="mainStore.layersOnMap.length">
                    <LayerLegendEntry
                        v-for="layer in mainStore.visibleLayers"
                        :key="layer.id"
                        :layer="layer"
                    ></LayerLegendEntry>
                </Accordion>
                <div
                    v-else
                    class="px-4"
                >
                    {{ t('legend.noLayers') }}
                </div>
            </ScrollPanel>
        </Panel>
    </div>
</template>
