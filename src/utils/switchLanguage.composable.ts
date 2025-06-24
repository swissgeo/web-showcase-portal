import { useTopicTree } from '@/composables/useTopicTree'
import useGeocat from '@/search/geocat'
import { useMainStore } from '@/store/main'
import { i18n, langToLocal } from '@/types/language'

export function useSwitchLanguage() {
    const { setGNUILanguage } = useGeocat()
    const mainStore = useMainStore()
    const { updateGeocatalogLanguage } = useTopicTree()

    function switchLanguage() {
        i18n.global.locale.value = langToLocal(
            mainStore.language
        ) as typeof i18n.global.locale.value
        localStorage.setItem('selectedLanguage', mainStore.language)
        setGNUILanguage()
        updateGeocatalogLanguage()
    }

    return {
        switchLanguage,
    }
}
