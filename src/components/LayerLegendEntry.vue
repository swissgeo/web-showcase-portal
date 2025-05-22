<script setup lang="ts">
import AccordionContent from 'primevue/accordioncontent'
import AccordionHeader from 'primevue/accordionheader'
import AccordionPanel from 'primevue/accordionpanel'
import { computed } from 'vue'

import type { Layer } from '@/types/Layer'

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
</script>

<template>
    <AccordionPanel :value="layer.id">
        <AccordionHeader>{{ layer.name }}</AccordionHeader>
        <AccordionContent>
            <img
                v-for="(service, index) in legendUrls"
                :key="index"
                :src="service?.legendUrl"
            />
        </AccordionContent>
    </AccordionPanel>
</template>
