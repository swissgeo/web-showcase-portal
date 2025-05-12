<script setup lang="ts">
import type { GeocodingResult } from '@geospatial-sdk/geocoding'

import IconField from 'primevue/iconfield'
import IftaLabel from 'primevue/iftalabel'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { GeonetworkRecord } from '@/types/gnRecord'

import useAddressSearch from '@/search/address'
import useGeocatSearch from '@/search/geocat'
import { useSearchStore } from '@/store/search'

const emits = defineEmits(['focus', 'blur'])

const { t } = useI18n()
const searchStore = useSearchStore()
const { searchGeocat } = useGeocatSearch()
const { searchAddress } = useAddressSearch()

const isSearching = computed(() => !!searchStore.searchTerm)

const searchTerm = computed({
    get() {
        return searchStore.searchTerm
    },
    set(value: string | null) {
        if (value === '') {
            // if we don't do this, and the user deletes the chars in the input, then the input
            // will be '' and the search is triggered with an empty string
            value = null
            searchStore.$reset()
            return
        }

        searchStore.setSearchTerm(value)

        if (value) {
            searchStore.setIsSearchingAddresses(true)
            searchStore.setIsSearchingGeocat(true)
            searchGeocat(value, (records: GeonetworkRecord[], count: number) => {
                // guarding against a pecularity: if the user deletes the search
                // entry with backspace, then it might be the case that a search is still
                // being triggered due to debouncing. Then when it returns there will be search results
                // even if there shouldn't be any
                if (searchStore.searchTerm) {
                    searchStore.setSearchResults(records)
                    searchStore.setSearchResultTotal(count)
                    searchStore.setIsSearchingGeocat(false)
                }
            })
            searchAddress(value, '2056', 'fr', 20, (records: GeocodingResult[]) => {
                // see comment above
                if (searchStore.searchTerm) {
                    searchStore.setSearchLocationResults(records)
                    searchStore.setIsSearchingAddresses(false)
                }
            })
        }
    },
})

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
