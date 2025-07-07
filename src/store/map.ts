import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { CapabilitiesLayer } from '@/types/mapPreview'
import type { MapUrlParameter } from '@/types/mapUrlParameters'

import { defaultBgLayer, defaultCenter, defaultLang, defaultZoomLevel } from '@/config/map.config'
import { convertToMapParameter } from '@/search/mapUrlUtils'

import { useGeocatalogStore } from './geocatalog'
import { useMainStore } from './main'

export const useMapStore = defineStore('map', () => {
    // State
    const mainStore = useMainStore()
    const geocatalogStore = useGeocatalogStore()

    const layers = computed(() =>
        [
            ...(mainStore.layersOnMap ?? []),
            ...(mainStore.tempPreviewLayer ? [mainStore.tempPreviewLayer] : []),
        ]
            .map((layer) => convertToMapParameter(layer))
            .join(';')
    )
    // Cache for WMS preview layers
    const cachedPreviewLayers = ref<Map<string, CapabilitiesLayer[]>>(new Map())

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

    function cachePreviewLayers(wmsBaseUrl: string, layers: CapabilitiesLayer[]) {
        cachedPreviewLayers.value.set(wmsBaseUrl, layers)
    }

    function getCachedPreviewLayers(wmsBaseUrl: string): CapabilitiesLayer[] | undefined {
        return cachedPreviewLayers.value.get(wmsBaseUrl)
    }

    return {
        // State
        mapUrlSearchParams,
        cachedPreviewLayers,
        // Actions
        setMapUrlSearchParams,
        resetStore,
        cachePreviewLayers,
        getCachedPreviewLayers,
    }
})
