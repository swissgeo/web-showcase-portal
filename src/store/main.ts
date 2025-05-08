import { defineStore } from 'pinia'

import type { Layer } from '@/types/Layer'

export interface MainStoreState {
    layersOnMap: Layer[]
    infoLayerId: string | null
    bgLayerId: string | null
    bgLayers: Layer[]
}

export const useMainStore = defineStore('main', {
    state: (): MainStoreState => {
        return {
            layersOnMap: [],
            infoLayerId: null,
            bgLayerId: 'ch.swisstopo.pixelkarte-farbe',
            bgLayers: [
                {
                    id: 'ch.swisstopo.pixelkarte-farbe',
                    name: 'Color Map',
                    visible: true,
                    opacity: 1,
                    geonetworkRecord: null,
                },
                {
                    id: 'ch.swisstopo.pixelkarte-grau',
                    name: 'Gray Map',
                    visible: false,
                    opacity: 1,
                    geonetworkRecord: null,
                },
            ]
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
        deleteLayerById(layerId: string) {
            this.layersOnMap = this.layersOnMap.filter(layer => layer.id !== layerId);
        },
        // Used to make the background layer exclusive
        // if a new one is selected, the previous one is set to false
        setBgLayerVisibility(layerId: string, visible: boolean) {
            this.bgLayerId = 'void';
            this.bgLayers.forEach(layer => {
                layer.visible = false;
                if(layer.id === layerId) {
                    layer.visible = visible;
                    if(visible) {
                        this.bgLayerId = layerId;
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
        }
    },
})
