import { defineStore } from 'pinia'

export interface UiStoreState {
    isLayerCartVisible: boolean
    isLayerLegendVisible: boolean
    isGeocatalogTreeVisible: boolean
}

export const useUiStore = defineStore('ui', {
    state: (): UiStoreState => {
        return {
            isLayerCartVisible: false,
            isLayerLegendVisible: false,
            isGeocatalogTreeVisible: false,
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
        toggleGeocatalogTree() {
            this.isGeocatalogTreeVisible = !this.isGeocatalogTreeVisible
        },
        setLayerLegendVisible(visible: boolean) {
            this.isLayerLegendVisible = visible
        },
        toggleLayerLegend() {
            this.isLayerLegendVisible = !this.isLayerLegendVisible
        },
    },
})
