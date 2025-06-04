<script setup lang="ts">
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { SEARCH_DEBOUNCE_DELAY } from '@/search'
import useAddressSearch from '@/search/address'
import useGeocat from '@/search/geocat'
import { useMainStore } from '@/store/main'
import { useMapStore } from '@/store/map'
import { useSearchStore } from '@/store/search'
import { debounce } from '@/utils/debounce'

const emits = defineEmits(['focus', 'blur'])

const searchArea = ref<HTMLElement | null>(null)
defineExpose({ searchArea })

const { t } = useI18n()
const searchStore = useSearchStore()
const geocatSearch = useGeocat()
const mainStore = useMainStore()
const mapStore = useMapStore()
const addressSearch = useAddressSearch()
const isSearching = computed(() => !!searchStore.searchTerm)
const language = computed(() => mainStore.language)
const triggerSearch = debounce((value: string) => {
    geocatSearch.searchGeocat(value)
    addressSearch.searchAddress(value, '2056', language.value, 20)
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

const onFocus = () => {
    emits('focus')
}

const onBlur = () => {
    emits('blur')
}

const clearSearch = () => {
    searchStore.resetSearch()
    mapStore.setMapUrlSearchParams({
        crossHairPosition: undefined,
    })
}

const selectedFederal = ref<number[]>([])
const selectedCantonal = ref<number[]>([])
const selectedCommunal = ref<number[]>([])

const selectedGroupIds = computed(() => [
    ...(Array.isArray(selectedFederal.value) ? selectedFederal.value : []),
    ...(Array.isArray(selectedCantonal.value) ? selectedCantonal.value : []),
    ...(Array.isArray(selectedCommunal.value) ? selectedCommunal.value : []),
])
watch(selectedGroupIds, (ids) => {
    if (searchTerm.value) {
        geocatSearch.searchGeocat(searchTerm.value, ids.length ? ids : undefined)
    }
})
</script>
<template>
    <div>
        <IconField>
            <InputIcon class="pi pi-search"></InputIcon>
            <InputText
                id="search"
                v-model="searchTerm"
                data-cy="input-search"
                class="w-full border-none shadow-none"
                :placeholder="t('searchPlaceholder')"
                @focus="onFocus"
                @blur="onBlur"
            ></InputText>
            <InputIcon
                v-if="isSearching"
                class="pi pi-times cursor-pointer"
                @click="clearSearch"
            />
        </IconField>
        <SearchFilter
            @focus="onFocus"
            @blur="onBlur"
        />
    </div>
</template>
