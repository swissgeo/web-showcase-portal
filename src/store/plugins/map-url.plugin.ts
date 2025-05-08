import type { PiniaPluginContext, Store } from 'pinia'

import { convertToMapParameter } from '@/search/mapUrlUtils'

import { type MainStoreState } from '../main'
import { useMapStore } from '../map'

export function mapUrlPlugin({ store }: PiniaPluginContext) {
    const mapStore = useMapStore()

    if (store.$id === 'main') {
        const typedStore = store as Store<'main', MainStoreState>
        store.$onAction(({
            name,
            after,
        }) => {
            if (['addLayerToMap', 'deleteLayerById'].includes(name)) {
                after(() => {
                    const newLayers = typedStore.layersOnMap
                    mapStore.setMapUrlSearchParams({
                        layers: newLayers.map((layer) => convertToMapParameter(layer)).join(';')
                    })
                })
            }
        })
    }
}

export default mapUrlPlugin
