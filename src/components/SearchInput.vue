<script setup lang="ts">
import IconField from 'primevue/iconfield'
import IftaLabel from 'primevue/iftalabel'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import SearchIcon from '@/assets/icons/search.svg?use'
import TimesIcon from '@/assets/icons/times.svg?use'
import { useSearchStore, type Layer } from '@/store/search'
import { debounce } from '@/utils/debounce'

// mock search results
const RESULTS = [
    {
        id: 'ch.astra.wanderland-sperrungen_umleitungen',
        name: 'Wanderwege',
    },
    {
        id: 'ch.bafu.neophyten-haargurke',
        name: 'Haargurke',
    },
    {
        id: 'ch.bav.haltestellen-oev',
        name: 'Haltestellen',
    },
    {
        id: 'ch.bafu.nabelstationen',
        name: 'Nabelstationen',
    },
    {
        id: 'ch.bafu.neophyten-bastardindigo',
        name: 'Bastarddingo',
    },
    {
        id: 'ch.vbs.schiessanzeigen',
        name: 'Schiessanzeigen',
    },
    {
        id: 'ch.bfs.erreichbarkeit-apotheken',
        name: 'Erreichbarkeit Apotheken',
    },
] as Layer[]

const { t } = useI18n()
const searchStore = useSearchStore()

const isSearching = computed(() => !!searchStore.searchTerm)

const searchTerm = computed({
    get() {
        return searchStore.searchTerm
    },
    set(value: string) {
        searchStore.setSearchTerm(value)
        doSearch(value)
    },
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const doSearch = debounce((_: string) => {
    searchStore.setSearchResults(RESULTS)
}, 200)

const clearSearch = () => {
    searchStore.clear()
}
</script>

<template>
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
            ></InputText>
            <label for="search">{{ t('searchPlaceholder') }}</label>
        </IftaLabel>
    </IconField>
</template>
