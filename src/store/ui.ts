import { defineStore } from 'pinia'

export interface UiStoreState {
    isLayerCartVisible: boolean
    isLayerLegendVisible: boolean
}

export const useUiStore = defineStore('ui', {
    state: (): UiStoreState => {
        return {
            isLayerCartVisible: false,
            isLayerLegendVisible: false,
        }
    },
    getters: {},
    actions: {
        setLayerCartVisible(visible: boolean) {
            this.isLayerCartVisible = visible
        },
        toggleLayerCart() {
            this.isLayerCartVisible = !this.isLayerCartVisible
        },
        setLayerLegendVisible(visible: boolean) {
            this.isLayerLegendVisible = visible
        },
        toggleLayerLegend() {
            this.isLayerLegendVisible = !this.isLayerLegendVisible
        },
    },
})
