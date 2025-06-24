<script setup lang="ts">
import AccordionContent from 'primevue/accordioncontent'
import AccordionHeader from 'primevue/accordionheader'
import AccordionPanel from 'primevue/accordionpanel'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { API3_BASE_URL } from '@/api/topics.api'
import { useMainStore } from '@/store/main'
import { LayerType, type Layer } from '@/types/layer'

const { t } = useI18n()

const { layer } = defineProps<{
    layer: Layer
}>()

const mainStore = useMainStore()

const legendUrls = computed(() => {
    if (layer.type === LayerType.Geonetwork) {
        const onlineResources = layer.geonetworkRecord?.onlineResources || []
        return onlineResources.reduce((legendUrls: string[], resource) => {
            const protocol = resource.accessServiceProtocol?.toLowerCase()
            if (protocol === 'wms') {
                try {
                    const baseUrl = resource.url
                    const legendUrl = new URL(baseUrl)
                    legendUrl.search = new URLSearchParams({
                        SERVICE: resource.accessServiceProtocol?.toUpperCase() || 'WMS',
                        REQUEST: 'GetLegendGraphic',
                        VERSION: '1.3.0',
                        FORMAT: 'image/png',
                        LAYER: resource.name,
                        SLD_VERSION: '1.1.0',
                    }).toString()
                    legendUrls.push(legendUrl.toString())
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error(`Error processing service ${resource.url}: ${e}`)
                }
            }
            return legendUrls
        }, [])
    } else {
        const legendUrl = `${API3_BASE_URL}/static/images/legends/${layer.id}_${mainStore.language}.png`
        return [legendUrl]
    }
})

const brokenImages = ref<Set<number>>(new Set())

function handleImgError(index: number) {
    brokenImages.value.add(index)
}
</script>

<template>
    <AccordionPanel :value="layer.id">
        <AccordionHeader
            :data-cy="`accordion-layer-legend-${layer.id}`"
            :pt="{
                toggleicon: 'flex-shrink-0 ml-1',
            }"
            ><span class="break-words">{{ layer.name }}</span></AccordionHeader
        >
        <AccordionContent>
            <template v-if="legendUrls.length > 0">
                <template
                    v-for="(legendUrl, index) in legendUrls"
                    :key="index"
                >
                    <img
                        v-if="!brokenImages.has(index)"
                        class="h-auto w-fit"
                        :src="legendUrl"
                        @error="handleImgError(index)"
                    />
                    <div
                        v-else
                        class="text-xs text-red-400"
                    >
                        {{ t('legend.brokenImage') }}
                    </div>
                </template>
            </template>
            <template v-else>
                <div class="text-sm font-medium text-gray-500">
                    {{ t('legend.noLegend') }}
                </div>
            </template>
        </AccordionContent>
    </AccordionPanel>
</template>
