import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useLanguage() {
    const { locale } = useI18n()

    const localeString = computed(() => {
        return locale.value.split('-')[0]
    })

    return {
        localeString,
    }
}
