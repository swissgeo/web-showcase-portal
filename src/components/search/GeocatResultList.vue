<script setup lang="ts">
import { useInfiniteScroll } from '@vueuse/core'
import { computed, inject, onMounted, useTemplateRef } from 'vue'

import SearchResultEntry from '@/components/search/GeocatSearchResultEntry.vue'
import { useMapPreview } from '@/composables/useMapPreview'
import useGeocat from '@/search/geocat'
import { useMainStore } from '@/store/main'
import { useSearchStore } from '@/store/search'

const el = useTemplateRef('resultList')
const { searchGeocat } = useGeocat()
const searchStore = useSearchStore()
const mainStore = useMainStore()
const { initializeMap } = useMapPreview()

const isDesktop = inject<boolean>('isDesktop', true)

const hasGeocatResults = computed(() => searchStore.geocatSearchResults.length > 0)
const hasMoreGeocatResults = computed(
    () =>
        searchStore.geocatSearchResults.length > 0 &&
        searchStore.geocatSearchResults.length < searchStore.searchResultTotal
)

useInfiniteScroll(
    el,
    () => {
        if (searchStore.searchTerm && !searchStore.isSearchingGeocat) {
            searchStore.incGeocatPage()
            const activeFilters = searchStore.getActiveFilters()
            const groupIds = [
                ...activeFilters.federal,
                ...activeFilters.cantonal,
                ...activeFilters.communal,
            ]
            searchGeocat(searchStore.searchTerm, groupIds)
        }
    },
    {
        distance: 10,
        canLoadMore: () => hasMoreGeocatResults.value,
    }
)

onMounted(() => {
    // Initialize the map when the component is mounted
    initializeMap()
})
</script>

<template>
    <!-- On mobile to prevent that the infinite scroll is dirctly triggered we need a max height on this element.
    When there are no more results to load, the height is set to 100% so that the scroll bar is not shown. -->

    <!-- TODO: this is still not ideal, because the scrolling can be a bit weird for the users.
    A better solution would be to do a custom implementation of the Accordion so the different pannels are always shown.
    Or we could use tabs instead of an accordion. -->
    <div
        ref="resultList"
        data-cy="div-geocat-search-results"
        class="mt-5 overflow-y-scroll p-4"
        :class="{ 'max-h-[65vh]': isDesktop, 'max-h-[calc(80vh-12rem)]': !isDesktop }"
    >
        <ul
            v-if="hasGeocatResults"
            data-cy="ul-geocat-search-results"
        >
            <SearchResultEntry
                v-for="result in searchStore.geocatSearchResults"
                :key="result.uniqueIdentifier"
                :result="result"
                :bg-layer-name="mainStore.bgLayerId!"
            />
        </ul>
    </div>
</template>
