<script setup lang="ts">
import Accordion from 'primevue/accordion'
import Button from 'primevue/button'
import Panel from 'primevue/panel'
import ScrollPanel from 'primevue/scrollpanel'
import { computed, inject, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'

import LayerLegendEntry from '@/components/LayerLegendEntry.vue'
import { useMainStore } from '@/store/main'
import { useUiStore } from '@/store/ui'

const isDesktop = inject<Ref<boolean>>('isDesktop')

const uiStore = useUiStore()
const mainStore = useMainStore()
const { t } = useI18n()

const closeIcon = computed(() => {
    return isDesktop?.value ? 'pi pi-chevron-right' : 'pi pi-times'
})
</script>

<template>
    <div data-cy="div-layer-legend">
        <Panel
            :header="t('legend.header')"
            class="absolute right-0 bottom-0 left-0 z-10 h-1/2 md:top-4 md:right-4 md:bottom-auto md:left-auto md:h-[380px]"
        >
            <template #icons>
                <Button
                    :text="true"
                    class="p-panel-header-icon p-link mr-1 cursor-pointer"
                    :icon="closeIcon"
                    data-cy="comp-layer-legend-close"
                    @click="uiStore.setLayerLegendVisible(false)"
                >
                </Button>
            </template>
            <ScrollPanel class="max-h-[300px] border-t border-neutral-200 py-8 md:w-[300px]">
                <Accordion v-if="mainStore.layersOnMap.length">
                    <LayerLegendEntry
                        v-for="layer in mainStore.visibleLayers"
                        :key="layer.id"
                        :layer="layer"
                    ></LayerLegendEntry>
                </Accordion>
                <div v-else>
                    {{ t('legend.noLayers') }}
                </div>
            </ScrollPanel>
        </Panel>
    </div>
</template>
