import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { MapUrlParameter, SingleCoordinate } from '@/types/mapUrlParameters'

import { convertToMapParameter } from '@/search/mapUrlUtils'

import { useGeocatalogStore } from './geocatalog'
import { useMainStore } from './main'

const defaultZoomLevel = 2
const defaultCenter: SingleCoordinate = [2650500,1182500]
const defaultLang = 'de'
const defaultBgLayer = 'ch.swisstopo.pixelkarte-farbe'

export const useMapStore = defineStore('map', () => {
    // State
    const mainStore = useMainStore()
    const geocatalogStore = useGeocatalogStore()

    const layers = computed(() =>
        mainStore.layersOnMap?.map((layer) => convertToMapParameter(layer)).join(';')
    )
    const mapUrlSearchParams = ref<Partial<MapUrlParameter>>({
        lang: defaultLang,
        z: defaultZoomLevel,
        center: defaultCenter,
        bgLayer: defaultBgLayer,
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
            lang: defaultLang,
            z: defaultZoomLevel,
            center: defaultCenter,
            bgLayer: defaultBgLayer,
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
