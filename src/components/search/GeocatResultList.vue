<script setup lang="ts">
import { useInfiniteScroll } from '@vueuse/core'
import { computed, inject, type Ref, useTemplateRef } from 'vue'

import SearchResultEntry from '@/components/search/GeocatSearchResultEntry.vue'
import useGeocatSearch from '@/search/geocat'
import { useSearchStore } from '@/store/search'

const el = useTemplateRef('resultList')
const { searchGeocat } = useGeocatSearch()
const searchStore = useSearchStore()

const isDesktop = inject<Ref<boolean>>('isDesktop')

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

/**
 * For the scroll overflow to work within the accordion (in mobile)
 * we need to give this a fixed height. Now I can't calculate it based on the
 * parent because there's a transition when opening the panel. So right now
 * I'm gonna take the screen height minus some value so that it won't be too
 * big and covered by the address accordion panel
 * TODO find a proper implementation for this
 */
const height = computed(() => {
    const height = (isDesktop?.value ?? false) ? `100%` : `${window.innerHeight - 300}px`
    return `height: ${height}`
})
</script>

<template>
    <div
        ref="resultList"
        class="overflow-y-scroll md:mt-5"
        :style="height"
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
