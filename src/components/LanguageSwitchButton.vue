<script lang="ts" setup>
import { ChevronsUpDown } from 'lucide-vue-next'
import Select from 'primevue/select'
import { computed } from 'vue'

import useGeocat from '@/search/geocat'
import { useTriggerSearch } from '@/search/triggerSearch.composable'
import { useMainStore } from '@/store/main'
import { useSearchStore } from '@/store/search'
import { SUPPORTED_LANG, type Language } from '@/types/language'

const options = SUPPORTED_LANG.map((lang) => ({
    label: lang.toLocaleUpperCase(),
    value: lang,
}))

const mainStore = useMainStore()
const searchStore = useSearchStore()
const { triggerSearch } = useTriggerSearch()
const { setGNUILanguage } = useGeocat()

const currentLanguage = computed({
    get() {
        return {
            label: mainStore.language.toLocaleUpperCase(),
            value: mainStore.language,
        }
    },
    set(value: { label: string; value: Language }) {
        if (value.value !== mainStore.language) {
            mainStore.setLanguage(value.value)
            const currentSearchTerm = searchStore.searchTerm?.valueOf
            if (currentSearchTerm) {
                setGNUILanguage()
                triggerSearch() // Trigger a search with the new language
            }
        }
    },
})
</script>

<template>
    <Select
        v-model="currentLanguage"
        :options="options"
        option-label="label"
        :pt="{
            root: { class: 'border-none bg-transparent shadow-none' },
            label: { class: 'p-0 text-sm text-black md:p-unset md:text-base leading-[25px]' },
            optionLabel: { class: 'text-black md:text-base text-sm' },
            dropdown: { class: 'w-4 md:w-5' },
        }"
        class="p-0 text-sm text-black md:p-3 md:text-base"
    >
        <template #dropdownicon>
            <ChevronsUpDown color="#6a7282" />
        </template>
    </Select>
</template>
