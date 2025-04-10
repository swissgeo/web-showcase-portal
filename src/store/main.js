import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => {
    return {
      layersOnMap: [],
      infoLayerId: null,
    }
  },
  getters: {
    layersOnMapCount(state) {
      return state.layersOnMap.length
    },
    isLayerOnMap(state) {
      return (layerId) => state.layersOnMap.find((layer) => layer === layerId)
    },
    showLayerInfo(state) {
      return state.infoLayerId !== null
    },
  },
  actions: {
    addLayerToMap(layerId) {
      this.layersOnMap.push(layerId)
    },
    setInfoLayerId(layerId) {
      this.infoLayerId = layerId
    },
    resetInfoLayerId() {
      this.infoLayerId = null
    },
  },
})
