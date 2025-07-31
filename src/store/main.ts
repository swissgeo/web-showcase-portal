import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import type { GeonetworkRecord } from '@/types/gnRecord'

import { convertToMapParameter } from '@/search/mapUrlUtils'
import { useMapStore } from '@/store/map'
import {
    i18n,
    getBrowserLanguage,
    type Language,
    langToLocal,
    SUPPORTED_LANG,
} from '@/types/language'
import { LayerType, type Layer } from '@/types/layer'

export type LayerConfig = {
    id: string
    label: string
    hasLegend: boolean
    background: boolean
}

const defaultBgLayerId = 'ch.swisstopo.pixelkarte-farbe'
const defaultBgLayers: Layer[] = [
    {
        id: 'ch.swisstopo.pixelkarte-farbe',
        name: 'layerCart.colorMap',
        visible: true,
        opacity: 1,
        geonetworkRecord: null,
        type: LayerType.Geocatalog,
    },
    {
        id: 'ch.swisstopo.pixelkarte-grau',
        name: 'layerCart.greyMap',
        visible: false,
        opacity: 1,
        geonetworkRecord: null,
        type: LayerType.Geocatalog,
    },
    {
        id: 'ch.swisstopo.swissimage',
        name: 'layerCart.aerialImagery',
        visible: false,
        opacity: 1,
        geonetworkRecord: null,
        type: LayerType.Geocatalog,
    },
]

export const useMainStore = defineStore('main', () => {
    // Language initialization
    const storedLanguage = localStorage.getItem('selectedLanguage') as Language | null
    const browserLanguage = getBrowserLanguage()
    const initialLanguage: Language =
        storedLanguage && SUPPORTED_LANG.includes(storedLanguage) ? storedLanguage : browserLanguage

    i18n.global.locale.value = langToLocal(initialLanguage) as typeof i18n.global.locale.value
    const mapStore = useMapStore()
    // State
    const layersOnMap = ref<Layer[]>([])
    const tempPreviewLayer = ref<Layer | null>(null)
    const infoLayerId = ref<string | null>(null)
    const infoLayerRecord = ref<GeonetworkRecord | null>(null)
    const bgLayerId = ref<string | null>(defaultBgLayerId)
    const bgLayers = ref<Layer[]>(defaultBgLayers)
    const language = ref<Language>(initialLanguage)
    const layerConfigs = ref<Record<string, Record<string, LayerConfig | null>>>({})

    // Getters
    const layersOnMapCount = computed(() => layersOnMap.value.length)
    const getLayerById = (layerId: string): Layer | null =>
        layersOnMap.value.find((layer) => layer.id === layerId) ?? null
    const isLayerOnMap = (layerId: string): boolean =>
        layersOnMap.value.findIndex((layer) => layer.id === layerId) !== -1
    const showLayerInfo = computed(() => infoLayerId.value !== null)
    const visibleLayers = computed(() => layersOnMap.value.filter((layer) => layer.visible))
    const getLayerConfigsByLang = (lang: string) => layerConfigs.value[lang] || null
    i18n.global.locale.value = langToLocal(initialLanguage) as typeof i18n.global.locale.value

    // Actions
    function addLayerToMap(layer: Layer) {
        layersOnMap.value.push(layer)
        updateMapUrlSearchParams()
    }

    function setMapLayers(layers: Layer[]) {
        layersOnMap.value = layers
        updateMapUrlSearchParams()
    }

    function setInfoLayerId(layerId: string) {
        if (infoLayerId.value !== layerId) {
            infoLayerRecord.value = null
        }
        infoLayerId.value = layerId
    }
    function setTempPreviewLayer(layer: Layer) {
        tempPreviewLayer.value = layer
        updateMapUrlSearchParams()
    }
    function resetTempPreviewLayer() {
        tempPreviewLayer.value = null
        updateMapUrlSearchParams()
    }
    function setInfoLayerRecord(record: GeonetworkRecord) {
        infoLayerRecord.value = record
    }
    function setLanguage(lang: Language) {
        language.value = lang
    }
    function resetInfoLayerId() {
        infoLayerId.value = null
        infoLayerRecord.value = null
    }
    function deleteLayerById(layerId: string) {
        layersOnMap.value = layersOnMap.value.filter((layer) => layer.id !== layerId)
        updateMapUrlSearchParams()
    }
    function setLayerVisibility(layerId: string, visible: boolean) {
        const layer = layersOnMap.value.find((layer) => layer.id === layerId)
        if (layer) {
            layer.visible = visible
        }
        updateMapUrlSearchParams()
    }
    function setLayerOpacity(layerId: string, opacity: number) {
        const layer = layersOnMap.value.find((layer) => layer.id === layerId)
        if (layer) {
            layer.opacity = opacity
        }
        updateMapUrlSearchParams()
    }
    function setBgLayerVisibility(layerId: string, visible: boolean) {
        bgLayerId.value = 'void'
        bgLayers.value.forEach((layer) => {
            layer.visible = false
            if (layer.id === layerId) {
                layer.visible = visible
                if (visible) {
                    bgLayerId.value = layerId
                }
            }
        })
        updateMapUrlSearchParams()
    }
    function replaceLayerOnMap(layer: Layer) {
        layersOnMap.value.splice(
            layersOnMap.value.findIndex((l) => l.id === layer.id),
            1,
            layer
        )
    }
    function moveLayerToIndex(oldIndex: number, newIndex: number) {
        if (oldIndex < 0 || oldIndex >= layersOnMap.value.length) return
        if (newIndex < 0 || newIndex >= layersOnMap.value.length) return
        const layer = layersOnMap.value[oldIndex]
        layersOnMap.value.splice(oldIndex, 1)
        layersOnMap.value.splice(newIndex, 0, layer)
        updateMapUrlSearchParams()
    }
    function setLayerConfigs(lang: string, configs: Record<string, LayerConfig | null>) {
        layerConfigs.value[lang] = configs
    }

    // Helper functions
    function updateMapUrlSearchParams() {
        mapStore.setMapUrlSearchParams({
            layers: [
                ...(layersOnMap.value ?? []),
                ...(tempPreviewLayer.value ? [tempPreviewLayer.value] : []),
            ]
                .map((layer) => convertToMapParameter(layer))
                .join(';'),
            bgLayer: bgLayerId.value ?? 'void',
            center: undefined,
        })
    }

    function resetStore() {
        layersOnMap.value = []
        infoLayerId.value = null
        infoLayerRecord.value = null
        bgLayerId.value = defaultBgLayerId
        bgLayers.value = defaultBgLayers
        language.value = initialLanguage
        layerConfigs.value = {}
        tempPreviewLayer.value = null
        i18n.global.locale.value = langToLocal(initialLanguage) as typeof i18n.global.locale.value
    }

    return {
        // state
        layersOnMap,
        infoLayerId,
        infoLayerRecord,
        bgLayerId,
        bgLayers,
        language,
        layerConfigs,
        tempPreviewLayer,

        // getters
        layersOnMapCount,
        visibleLayers,
        getLayerById,
        getLayerConfigsByLang,
        isLayerOnMap,
        showLayerInfo,

        // actions
        addLayerToMap,
        setMapLayers,
        setInfoLayerId,
        setInfoLayerRecord,
        setLanguage,
        resetInfoLayerId,
        deleteLayerById,
        setLayerVisibility,
        setLayerOpacity,
        setBgLayerVisibility,
        replaceLayerOnMap,
        moveLayerToIndex,
        setLayerConfigs,
        setTempPreviewLayer,
        resetTempPreviewLayer,
        resetStore,
    }
})
