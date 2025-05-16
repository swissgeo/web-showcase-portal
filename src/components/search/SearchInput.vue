<script setup lang="ts">
import IconField from 'primevue/iconfield'
import IftaLabel from 'primevue/iftalabel'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { SEARCH_DEBOUNCE_DELAY } from '@/search'
import useAddressSearch from '@/search/address'
import useGeocatSearch from '@/search/geocat'
import { useSearchStore } from '@/store/search'
import { isLanguageSupported } from '@/types/language'
import { debounce } from '@/utils/debounce'

const emits = defineEmits(['focus', 'blur'])

const { t } = useI18n()
const searchStore = useSearchStore()
const geocatSearch = useGeocatSearch()
const addressSearch = useAddressSearch()
const isSearching = computed(() => !!searchStore.searchTerm)

const triggerSearch = debounce((value: string) => {
    geocatSearch.searchGeocat(value)
    addressSearch.searchAddress(value, '2056', getBrowserLanguage(), 20)
}, SEARCH_DEBOUNCE_DELAY)

const searchTerm = computed({
    get() {
        return searchStore.searchTerm
    },
    set(value: string | null) {
        searchStore.resetSearch()
        if (value === '') {
            // if we don't do this, and the user deletes the chars in the input, then the input
            // will be '' and the search is triggered with an empty string
            value = null
            geocatSearch.cancelSearch()
            return
        }

        searchStore.setSearchTerm(value)

        if (value) {
            triggerSearch(value)
        }
    },
})

function getBrowserLanguage() {
    const language = navigator.language
    const lang = language.split('-')[0]
    if (isLanguageSupported(lang)) {
        return lang
    } else {
        return 'en'
    }
}

const onFocus = () => {
    emits('focus')
}

const onBlur = () => {
    emits('blur')
}

const clearSearch = () => {
    searchStore.$reset()
}
</script>

<template>
    <div class="rounded-t-lg p-4">
        <IconField>
            <IftaLabel>
                <InputIcon
                    class="pi"
                    :class="{ 'pi-search': !isSearching, 'pi-times cursor-pointer': isSearching }"
                    @click="clearSearch"
                ></InputIcon>
                <InputText
                    id="search"
                    v-model="searchTerm"
                    data-cy="input-search"
                    class="w-full"
                    @focus="onFocus"
                    @blur="onBlur"
                ></InputText>
                <label for="search">{{ t('searchPlaceholder') }}</label>
            </IftaLabel>
        </IconField>
        <!-- on desktop, we need the search results positioned here as a child
         of the input, hence the slot
         -->
        <slot></slot>
    </div>
</template>
