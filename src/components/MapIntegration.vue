<script setup lang="ts">
import { computed, watch } from 'vue'

import type { Layer } from '@/types/Layer'

import { useMainStore } from '@/store/main'
import { getWMSResourceData } from '@/utils/layerUtils'

const mainStore = useMainStore()

const convertToMapParameter = (layer: Layer) => {
    if (!layer.geonetworkRecord) {
        return
    }

    const { url, name } = getWMSResourceData(layer.geonetworkRecord)

    return `WMS|${url}|${name}`
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

watch(urlString, (value) => {
    // eslint-disable-next-line no-console
    console.debug(value)
})
</script>

<template>
    <iframe
        :src="urlString"
        class="w-full h-fit"
        allow="geolocation"
    ></iframe>
</template>
