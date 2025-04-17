import type { Layer } from '@/store/search'
import { defineStore } from 'pinia'

export interface MainStoreState {
    layersOnMap: Layer[]
    infoLayerId: string | null
}

export const useMainStore = defineStore('main', {
    state: (): MainStoreState => {
        return {
            layersOnMap: [],
            infoLayerId: null,
        }
    },
    getters: {
        layersOnMapCount(state) {
            return state.layersOnMap.length
        },
        getLayerById(state) {
            return (layerId: string): Layer | null => {
                return state.layersOnMap.find((layer) => layer.id === layerId) ?? null
            }
        },
        isLayerOnMap(state): (arg0: string) => boolean {
            return (layerId: string): boolean => {
                return state.layersOnMap.findIndex((layer) => layer.id === layerId) !== -1
            }
        },
        showLayerInfo(state) {
            return state.infoLayerId !== null
        },
    },
    actions: {
        addLayerToMap(layer: Layer) {
            this.layersOnMap.push(layer)
        },
        setInfoLayerId(layerId: string) {
            this.infoLayerId = layerId
        },
        resetInfoLayerId() {
            this.infoLayerId = null
        },
    },
})
