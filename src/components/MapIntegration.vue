<script setup lang="ts">
import { computed } from 'vue'

import type { GeonetworkRecord } from '@/types/gnRecord'
import type { Layer } from '@/types/Layer'

import { useMainStore } from '@/store/main'

const mainStore = useMainStore()

const getServiceOnlineResource = (record: GeonetworkRecord) => {
    const onlineresources = record.onlineResources
    for (const res of onlineresources) {
        if (
            res.type === 'service' &&
            res.accessServiceProtocol &&
            ['wms', 'wmts'].includes(res.accessServiceProtocol)
        ) {
            return res
        }
    }
    return null
}

const convertToMapParameter = (layer: Layer) => {
    const record = layer.geonetworkRecord
    if (!record) {
        throw new Error("Can't add this to the map")
    }
    const resource = getServiceOnlineResource(record)
    if (!resource) {
        throw new Error("Can't add this to the map")
    }

    if (resource.accessServiceProtocol === 'wms') {
        // TODO this name is somewhere!
        return `WMS|${resource.description}|${layer.title}`
    }
    return ''
}

const urlString = computed(() => {
    const baseUrl = 'https://map.geo.admin.ch/#embed'
    const searchParams = new URLSearchParams()

    searchParams.append('lang', 'de')
    searchParams.append('z', '1')
    searchParams.append('center', '2660000,1190000')
    searchParams.append('bgLayer', 'ch.swisstopo.pixelkarte-farbe')

    searchParams.append(
        'layers',
        mainStore.layersOnMap.map((layer) => convertToMapParameter(layer)).join(';')
    )

    return `${baseUrl}/?${searchParams.toString()}`
})
</script>

<template>
    <iframe
        :src="urlString"
        class="w-full h-fit"
        allow="geolocation"
    ></iframe>
</template>
