import { useMainStore } from '@/store/main'
import { useMapStore } from '@/store/map'
import { useSearchStore } from '@/store/search'
import { useUiStore } from '@/store/ui'

export function useResetApp() {
    const uiStore = useUiStore()
    const mapStore = useMapStore()
    const mainStore = useMainStore()
    const searchStore = useSearchStore()

    function resetApp() {
        uiStore.resetStore()
        searchStore.resetStore()
        mainStore.resetStore()
        mapStore.resetStore()
    }
    return {
        resetApp,
    }
}
