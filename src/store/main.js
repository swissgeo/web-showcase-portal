import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => {
    return {
      layersOnMap: [],
    }
  },
  getters: {
    layersOnMapCount(state) {
      return state.layersOnMap.length
    },
    isLayerOnMap(state) {
      return (layerId) => state.layersOnMap.find((layer) => layer === layerId)
    },
  },
  actions: {
    addLayerToMap(layerId) {
      this.layersOnMap.push(layerId)
    },
  },
})
