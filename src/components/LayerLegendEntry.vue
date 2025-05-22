<script setup lang="ts">
import AccordionContent from 'primevue/accordioncontent'
import AccordionHeader from 'primevue/accordionheader'
import AccordionPanel from 'primevue/accordionpanel'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import type { Layer } from '@/types/Layer'

const { t } = useI18n()

const { layer } = defineProps<{
    layer: Layer
}>()

const legendUrls = computed(() => {
    const onlineResources = layer.geonetworkRecord?.onlineResources || []
    const serviceLinks = onlineResources
        .filter((resource) => {
            const protocol = resource.accessServiceProtocol?.toLowerCase()
            return protocol === 'wms'
        })
        .map((resource) => {
            try {
                const baseUrl = resource.url
                const serviceUrl = new URL(baseUrl)
                const legendUrl = new URL(baseUrl)

                // Set parameters for GetLegendGraphic
                legendUrl.search = new URLSearchParams({
                    SERVICE: resource.accessServiceProtocol || 'WMS',
                    REQUEST: 'GetLegendGraphic',
                    VERSION: '1.3.0',
                    FORMAT: 'image/png',
                    LAYER: resource.name,
                    // STYLE: 'default', commented out as not all services support this
                    SLD_VERSION: '1.1.0',
                }).toString()

                return {
                    url: serviceUrl.toString(),
                    name: resource.name || 'No title',
                    protocol: resource.accessServiceProtocol?.toUpperCase() || 'WMS',
                    legendUrl: legendUrl.toString(),
                }
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(`Error processing service ${resource.url}: ${e}`)
                return null
            }
        })
        .filter(Boolean)

    return serviceLinks
})

const brokenImages = ref<Set<number>>(new Set())

function handleImgError(index: number) {
    brokenImages.value.add(index)
}
</script>

<template>
    <AccordionPanel :value="layer.id">
        <AccordionHeader>{{ layer.name }}</AccordionHeader>
        <AccordionContent>
            <template v-if="legendUrls.length > 0">
                <template
                    v-for="(service, index) in legendUrls"
                    :key="index"
                >
                    <img
                        v-if="!brokenImages.has(index)"
                        class="h-auto w-fit"
                        :src="service?.legendUrl"
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
