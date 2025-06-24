import { defineStore } from 'pinia'

import type { MapUrlParameter } from '@/types/mapUrlParameters'

import { convertToMapParameter } from '@/search/mapUrlUtils'

import { useGeocatalogStore } from './geocatalog'
import { useMainStore } from './main'

export interface SearchStoreState {
    mapUrlSearchParams: Partial<MapUrlParameter>
}

export const useMapStore = defineStore('map', {
    state: (): SearchStoreState => {
        const mainStore = useMainStore()
        const geocatalogStore = useGeocatalogStore()
        return {
            mapUrlSearchParams: {
                lang: 'de',
                z: 1,
                center: [2660000, 1190000],
                bgLayer: 'ch.swisstopo.pixelkarte-farbe',
                layers: mainStore.layersOnMap
                    .map((layer) => convertToMapParameter(layer))
                    .join(';'),
                hideEmbedUI: true,
                topic: geocatalogStore.currentTopic,
            } as Partial<MapUrlParameter>,
        }
    },
    actions: {
        setMapUrlSearchParams(parameters: Partial<MapUrlParameter>) {
            this.mapUrlSearchParams = {
                ...this.mapUrlSearchParams,
                ...parameters,
            }
        },
    },
})
