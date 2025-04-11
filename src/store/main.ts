import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => {
    return {
      layersOnMap: [] as string[],
      infoLayerId: null as string | null,
    }
  },
  getters: {
    layersOnMapCount(state) {
      return state.layersOnMap.length
    },
    isLayerOnMap(state): (arg0: string) => boolean {
      return (layerId: string): boolean => {
        return state.layersOnMap.findIndex((layer) => layer === layerId) !== -1
      }
    },
    showLayerInfo(state) {
      return state.infoLayerId !== null
    },
  },
  actions: {
    addLayerToMap(layerId: string) {
      this.layersOnMap.push(layerId)
    },
    setInfoLayerId(layerId: string) {
      this.infoLayerId = layerId
    },
    resetInfoLayerId() {
      this.infoLayerId = null
    },
  },
})
