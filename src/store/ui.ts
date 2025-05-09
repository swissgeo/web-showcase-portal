import { defineStore } from 'pinia'

export interface UiStoreState {
    isLayerCartVisible: boolean
}

export const useUiStore = defineStore('ui', {
    state: (): UiStoreState => {
        return {
            isLayerCartVisible: false,
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
    },
})
