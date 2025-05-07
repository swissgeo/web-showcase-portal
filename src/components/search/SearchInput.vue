<script setup lang="ts">
import IconField from 'primevue/iconfield'
import IftaLabel from 'primevue/iftalabel'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { GeonetworkRecord } from '@/types/gnRecord'

import useGeocatSearch from '@/search/geocat'
import { useSearchStore } from '@/store/search'
import useAddressSearch from '@/search/address'
import type { GeocodingResult } from '@geospatial-sdk/geocoding'

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
    set(value: string) {
        searchStore.setSearchTerm(value)
        searchGeocat(value, (records: GeonetworkRecord[]) => searchStore.setSearchResults(records))
        searchAddress(value, '2056', 'fr', 20, (records: GeocodingResult[]) =>
            searchStore.setSearchLocationResults(records)
        )
    },
})

const onFocus = () => {
    emits('focus')
}

const onBlur = () => {
    emits('blur')
}

const clearSearch = () => {
    searchStore.clear()
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
