import { defineStore } from 'pinia'

import type { GeonetworkRecord } from '@/types/gnRecord'
import type { Layer } from '@/types/Layer'

import {
    i18n,
    getBrowserLanguage,
    type Language,
    langToLocal,
    SUPPORTED_LANG,
} from '@/types/language'

export type LayerConfig = {
    id: string
    label: string
    hasLegend: boolean
    background: boolean
}

export interface MainStoreState {
    layersOnMap: Layer[]
    infoLayerId: string | null
    infoLayerRecord: GeonetworkRecord | null
    infoLayerHtml: string | null // HTML to display in the geocatalog layer details
    bgLayerId: string | null
    bgLayers: Layer[]
    language: Language
    layerConfigs: Record<string, Record<string, LayerConfig | null>> // lang: id: LayerConfig | null
}

export const useMainStore = defineStore('main', {
    state: (): MainStoreState => {
        const storedLanguage = localStorage.getItem('selectedLanguage') as Language | null
        const browserLanguage = getBrowserLanguage()

        const initialLanguage: Language =
            storedLanguage && SUPPORTED_LANG.includes(storedLanguage)
                ? storedLanguage
                : browserLanguage

        i18n.global.locale.value = langToLocal(initialLanguage) as typeof i18n.global.locale.value
        return {
            layersOnMap: [],
            infoLayerId: null,
            infoLayerRecord: null,
            infoLayerHtml: null,
            bgLayerId: 'ch.swisstopo.pixelkarte-farbe',
            bgLayers: [
                {
                    id: 'ch.swisstopo.pixelkarte-farbe',
                    name: 'layerCart.colorMap',
                    visible: true,
                    opacity: 1,
                    geonetworkRecord: null,
                    type: 'Geocatalog',
                },
                {
                    id: 'ch.swisstopo.pixelkarte-grau',
                    name: 'layerCart.greyMap',
                    visible: false,
                    opacity: 1,
                    geonetworkRecord: null,
                    type: 'Geocatalog',
                },
                {
                    id: 'ch.swisstopo.swissimage',
                    name: 'layerCart.aerialImagery',
                    visible: false,
                    opacity: 1,
                    geonetworkRecord: null,
                    type: 'Geocatalog',
                },
            ],
            language: initialLanguage,
            layerConfigs: {},
        }
    },
    getters: {
        layersOnMapCount(state: MainStoreState) {
            return state.layersOnMap.length
        },
        getLayerById(state: MainStoreState) {
            return (layerId: string): Layer | null => {
                return state.layersOnMap.find((layer) => layer.id === layerId) ?? null
            }
        },
        isLayerOnMap(state: MainStoreState): (arg0: string) => boolean {
            return (layerId: string): boolean => {
                return state.layersOnMap.findIndex((layer) => layer.id === layerId) !== -1
            }
        },
        showLayerInfo(state: MainStoreState) {
            return state.infoLayerId !== null
        },
        visibleLayers(state: MainStoreState) {
            return state.layersOnMap.filter((layer) => layer.visible)
        },
        getLayerConfigsByLang: (state: MainStoreState) => (lang: string) => {
            return state.layerConfigs[lang] || null
        },
    },
    actions: {
        addLayerToMap(layer: Layer) {
            this.layersOnMap.push(layer)
        },
        setInfoLayerId(layerId: string) {
            if (this.infoLayerId !== layerId) {
                // layer id has changed, reset the info to trigger the
                // watcher in the details
                this.infoLayerRecord = null
                this.infoLayerHtml = null
            }
            this.infoLayerId = layerId
        },
        setInfoLayerRecord(record: GeonetworkRecord) {
            this.infoLayerRecord = record
        },
        setInfoLayerHtml(html: string | null) {
            this.infoLayerHtml = html
        },
        setLanguage(language: Language) {
            this.language = language
            i18n.global.locale.value = langToLocal(language) as typeof i18n.global.locale.value
            localStorage.setItem('selectedLanguage', language)
        },
        resetInfoLayerId() {
            this.infoLayerId = null
            this.infoLayerRecord = null
            this.infoLayerHtml = null
        },
        deleteLayerById(layerId: string) {
            this.layersOnMap = this.layersOnMap.filter((layer) => layer.id !== layerId)
        },
        setLayerVisibility(layerId: string, visible: boolean) {
            const layer = this.layersOnMap.find((layer) => layer.id === layerId)
            if (layer) {
                layer.visible = visible
            }
        },
        setLayerOpacity(layerId: string, opacity: number) {
            const layer = this.layersOnMap.find((layer) => layer.id === layerId)
            if (layer) {
                layer.opacity = opacity
            }
        },
        // Used to make the background layer exclusive
        // if a new one is selected, the previous one is set to false
        setBgLayerVisibility(layerId: string, visible: boolean) {
            this.bgLayerId = 'void'
            this.bgLayers.forEach((layer) => {
                layer.visible = false
                if (layer.id === layerId) {
                    layer.visible = visible
                    if (visible) {
                        this.bgLayerId = layerId
                    }
                }
            })
        },
        moveLayerToIndex(oldIndex: number, newIndex: number) {
            if (oldIndex < 0 || oldIndex >= this.layersOnMap.length) {
                return
            }
            if (newIndex < 0 || newIndex >= this.layersOnMap.length) {
                return
            }
            const layer = this.layersOnMap[oldIndex]
            this.layersOnMap.splice(oldIndex, 1)
            this.layersOnMap.splice(newIndex, 0, layer)
        },
        setLayerConfigs(lang: string, configs: Record<string, LayerConfig | null>) {
            this.layerConfigs[lang] = configs
        },
    },
})
