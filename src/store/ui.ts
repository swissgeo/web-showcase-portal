import { defineStore } from 'pinia'

export interface UiStoreState {
    layerCartVisible: boolean
}

export const useUiStore = defineStore('ui', {
    state: (): UiStoreState => {
        return {
            layerCartVisible: false,
        }
    },
    getters: {

    },
    actions: {
        setLayerCartVisible(visible: boolean) {
            this.layerCartVisible = visible
        },
        toggleLayerCart() {
            this.layerCartVisible = !this.layerCartVisible
        },
    },
})
