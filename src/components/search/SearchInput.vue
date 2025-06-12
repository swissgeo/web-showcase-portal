<script setup lang="ts">
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import useGeocat from '@/search/geocat'
import { useMapStore } from '@/store/map'
import { useTriggerSearch } from '@/search/triggerSearch.composable'
import { useSearchStore } from '@/store/search'

const emits = defineEmits(['focus', 'blur'])

const searchArea = ref<HTMLElement | null>(null)
defineExpose({ searchArea })

const { t } = useI18n()
const { triggerSearch } = useTriggerSearch()
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
            triggerSearch()
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
