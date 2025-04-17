<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

// @ts-expect-error This import isn't recognized by TS
import SearchIcon from '@/assets/icons/search.svg?use'
// @ts-expect-error This import isn't recognized by TS
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
    <div class="relative">
        <input
            v-model="searchTerm"
            :placeholder="t('searchPlaceholder')"
            class="text-2xl"
        />
        <div class="absolute right-0 top-0 py-2 pr-2 h-[32px]">
            <SearchIcon
                v-if="!searchStore.searchTerm"
                class="h-[32px] w-[32px]"
            />
            <button
                v-else
                class="cursor-pointer h-[32px] w-[32px]"
                @click="clearSearch"
            >
                <TimesIcon class="h-[32px] w-[32px]" />
            </button>
        </div>
    </div>
</template>
