import { defineStore } from 'pinia'

export interface GeocatalogStore {
    expandedKeys: string[]
}

export const useGeocatalogStore = defineStore('geocatalog', {
    state: (): GeocatalogStore => {
        return {
            expandedKeys: [],
        }
    },
    getters: {},
    actions: {
        addExpandedKey(key: string) {
            if (!this.expandedKeys.includes(key)) {
                this.expandedKeys.push(key);
            }
        },
        removeExpandedKey(key: string) {
            const idx = this.expandedKeys.indexOf(key);
            if (idx !== -1) {
                this.expandedKeys.splice(idx, 1);
            }
        },
    },
})
