<script setup>
import { computed } from 'vue'
import { debounce } from '@/utils/debounce'
import { useI18n } from 'vue-i18n'
import { useSearchStore } from '@/store/search'

import SearchIcon from '@/assets/icons/search.svg?use'
import TimesIcon from '@/assets/icons/times.svg?use'

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
]

const { t } = useI18n()
const searchStore = useSearchStore()

const searchTerm = computed({
  get() {
    return searchStore.searchTerm
  },
  set(value) {
    searchStore.setSearchTerm(value)
    doSearch(value)
  },
})

const doSearch = debounce(() => {
  searchStore.setSearchResults(RESULTS)
}, 200)

const clearSearch = () => {
  searchStore.clear()
}
</script>

<template>
  <div class="relative">
    <input v-model="searchTerm" :placeholder="t('searchPlaceholder')" class="text-2xl" />
    <div class="absolute right-0 top-0 py-2 pr-2 h-[32px]">
      <SearchIcon v-if="!searchStore.searchTerm" class="h-[32px] w-[32px]" />
      <button v-else @click="clearSearch" class="cursor-pointer h-[32px] w-[32px]">
        <TimesIcon class="h-[32px] w-[32px]" />
      </button>
    </div>
  </div>
</template>
