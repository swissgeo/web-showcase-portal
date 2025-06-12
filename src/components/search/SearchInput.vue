<script setup lang="ts">
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import useGeocat from '@/search/geocat'
import { useMapStore } from '@/store/map'
import { useSearchStore } from '@/store/search'

const emits = defineEmits(['focus', 'blur'])

const searchArea = ref<HTMLElement | null>(null)
defineExpose({ searchArea })

const { t } = useI18n()
const searchStore = useSearchStore()
const geocatSearch = useGeocat()
const mapStore = useMapStore()
const isSearching = computed(() => !!searchStore.searchTerm)

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
            geocatSearch.searchGeocat(
                value,
                selectedGroupIds.value.length ? selectedGroupIds.value : undefined
            )
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

const selectedFederal = computed({
    get: () => searchStore.selectedFederal,
    set: (val) => searchStore.setSelectedFederal(val),
})
const selectedCantonal = computed({
    get: () => searchStore.selectedCantonal,
    set: (val) => searchStore.setSelectedCantonal(val),
})
const selectedCommunal = computed({
    get: () => searchStore.selectedCommunal,
    set: (val) => searchStore.setSelectedCommunal(val),
})

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
    </div>
</template>
