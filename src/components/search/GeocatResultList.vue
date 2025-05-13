<script setup lang="ts">
import { useInfiniteScroll } from '@vueuse/core'
import { useTemplateRef } from 'vue'

import SearchResultEntry from '@/components/search/GeocatSearchResultEntry.vue'
import useGeocatSearch from '@/search/geocat'
import { useSearchStore } from '@/store/search'

const el = useTemplateRef('resultList')
const { searchGeocat } = useGeocatSearch()
const searchStore = useSearchStore()

useInfiniteScroll(
    el,
    () => {
        if (searchStore.searchTerm && !searchStore.isSearchingGeocat) {
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
        class="h-[2000px] overflow-y-scroll"
    >
        <!-- the absolute height is needed for the infinite scrolling to work
         on the mobile
         -->
        <ul
            v-if="searchStore.geocatSearchResults.length"
            data-cy="ul-geocat-search-results"
            class="md:mt-5"
        >
            <SearchResultEntry
                v-for="result in searchStore.geocatSearchResults"
                :key="result.uniqueIdentifier"
                :result="result"
            ></SearchResultEntry>
        </ul>
    </div>
</template>
