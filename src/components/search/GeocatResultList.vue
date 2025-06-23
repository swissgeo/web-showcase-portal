<script setup lang="ts">
import { useInfiniteScroll } from '@vueuse/core'
import { useTemplateRef } from 'vue'

import SearchResultEntry from '@/components/search/GeocatSearchResultEntry.vue'
import useGeocat from '@/search/geocat'
import { useSearchStore } from '@/store/search'

const el = useTemplateRef('resultList')
const { searchGeocat } = useGeocat()
const searchStore = useSearchStore()

useInfiniteScroll(
    el,
    () => {
        if (searchStore.searchTerm && !searchStore.isSearchingGeocat) {
            searchStore.incGeocatPage()
            searchGeocat(searchStore.searchTerm)
        }
    },
    {
        distance: 10,
        canLoadMore: () => {
            return !!(
                searchStore.geocatSearchResults.length &&
                searchStore.geocatSearchResults.length < searchStore.searchResultTotal
            )
        },
    }
)
</script>

<template>
    <div
        ref="resultList"
        class="mt-5 overflow-y-scroll"
        :style="'height: 100%'"
        data-cy="div-geocat-search-results"
    >
        <ul
            v-if="searchStore.geocatSearchResults.length"
            data-cy="ul-geocat-search-results"
        >
            <SearchResultEntry
                v-for="result in searchStore.geocatSearchResults"
                :key="result.uniqueIdentifier"
                :result="result"
            ></SearchResultEntry>
        </ul>
    </div>
</template>
