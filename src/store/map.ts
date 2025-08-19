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
    const isUpdatedUrlParameters = ref<boolean>(true)
    const layers = computed(() =>
        [
            ...(mainStore.layersOnMap ?? []),
            ...(mainStore.tempPreviewLayer ? [mainStore.tempPreviewLayer] : []),
        ]
            .map((layer) => convertToMapParameter(layer))
            .join(';')
    )
    // Cache for WMS preview layers
    const cachedPreviewRootLayers = ref<Map<string, CapabilitiesLayer>>(new Map())

    const mapUrlSearchParams = ref<Partial<MapUrlParameter>>({
        lang: defaultLang,
        z: defaultZoomLevel,
        center: defaultCenter,
        bgLayer: defaultBgLayer,
        layers: layers.value,
        hideEmbedUI: true,
        topic: geocatalogStore.currentTopic?.id,
    })
    // Actions
    // Be careful with the `updateMap` parameter, it should be set to false when the map is not supposed to be updated (e.g., when the embed map viewer is handling the updates)
    function setMapUrlSearchParams(
        parameters: Partial<MapUrlParameter>,
        updateMap: boolean = true
    ) {
        mapUrlSearchParams.value = {
            ...mapUrlSearchParams.value,
            ...parameters,
        }

        if (updateMap) {
            setIsUpdatedUrlParameters(true) // Enable updated URL parameters in store
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
            topic: geocatalogStore.currentTopic?.id,
        }
        setIsUpdatedUrlParameters(true)
    }

    function cachePreviewRootLayer(wmsBaseUrl: string, rootLayer: CapabilitiesLayer) {
        cachedPreviewRootLayers.value.set(wmsBaseUrl, rootLayer)
    }

    function getCachedPreviewRootLayer(wmsBaseUrl: string): CapabilitiesLayer | undefined {
        return cachedPreviewRootLayers.value.get(wmsBaseUrl)
    }

    function setIsUpdatedUrlParameters(value: boolean) {
        isUpdatedUrlParameters.value = value
    }

    return {
        // State
        isUpdatedUrlParameters,
        mapUrlSearchParams,
        cachedPreviewRootLayers,
        // Actions
        setMapUrlSearchParams,
        setIsUpdatedUrlParameters,
        resetStore,
        cachePreviewRootLayer,
        getCachedPreviewRootLayer,
    }
})
