import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { MapUrlParameter } from '@/types/mapUrlParameters'

import { convertToMapParameter } from '@/search/mapUrlUtils'

import { useGeocatalogStore } from './geocatalog'
import { useMainStore } from './main'

export const useMapStore = defineStore('map', () => {
    // State
    const mainStore = useMainStore()
    const geocatalogStore = useGeocatalogStore()

    const layers = computed(() =>
        mainStore.layersOnMap?.map((layer) => convertToMapParameter(layer)).join(';')
    )
    const mapUrlSearchParams = ref<Partial<MapUrlParameter>>({
        lang: 'de',
        z: 1,
        center: [2660000, 1190000],
        bgLayer: 'ch.swisstopo.pixelkarte-farbe',
        layers: layers.value,
        hideEmbedUI: true,
        topic: geocatalogStore.currentTopic,
    })
    // Actions
    function setMapUrlSearchParams(parameters: Partial<MapUrlParameter>) {
        mapUrlSearchParams.value = {
            ...mapUrlSearchParams.value,
            ...parameters,
        }
    }

    function resetStore() {
        mapUrlSearchParams.value = {
            lang: 'de',
            z: 1,
            center: [2660000, 1190000],
            bgLayer: 'ch.swisstopo.pixelkarte-farbe',
            layers: layers.value,
            hideEmbedUI: true,
            topic: geocatalogStore.currentTopic,
        }
    }

    return {
        // State
        mapUrlSearchParams,
        // Actions
        setMapUrlSearchParams,
        resetStore,
    }
})
