import { defineStore } from 'pinia'

export interface UiStoreState {
    // TODO(IS): Make these UI exclusive open/close states
    // e.g. if layer cart is open, geocatalog tree should be closed
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
            // Close geocatalog tree if layer cart is opened
            if (this.isLayerCartVisible) {
                this.isGeocatalogTreeVisible = false
            }
        },
        toggleGeocatalogTree() {
            this.isGeocatalogTreeVisible = !this.isGeocatalogTreeVisible
            // Close layer cart if geocatalog tree is opened
            if (this.isGeocatalogTreeVisible) {
                this.isLayerCartVisible = false
            }
        },
        setLayerLegendVisible(visible: boolean) {
            this.isLayerLegendVisible = visible
        },
        toggleLayerLegend() {
            this.isLayerLegendVisible = !this.isLayerLegendVisible
        },
    },
})
