<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'
import Card from 'primevue/card'
import { computed, useTemplateRef } from 'vue'

import LegendButton from '@/components/LayerLegendButton.vue'
import SearchInput from '@/components/search/SearchInput.vue'
import SearchKeywordContainer from '@/components/search/SearchKeywordContainer.vue'
import SearchResultsDesktop from '@/components/search/SearchResultsDesktop.vue'
import { useMainStore } from '@/store/main'
import { useSearchStore } from '@/store/search'

const searchContainer = useTemplateRef<HTMLElement>('searchContainer')

const searchStore = useSearchStore()
const mainStore = useMainStore()
const isOpenSearch = computed(() => searchStore.isOpenSearch)
const searchTerm = computed(() => searchStore.searchTerm)

const isSearching = computed(() => !!searchTerm.value && isOpenSearch.value)

const openSearch = () => {
    searchStore.setIsOpenSearch(true)
}

// To correctly close the search results when clicking outside of the search input or the search results
// we need to use the onClickOutside function from vueuse (to detect clicks on elements of this website) but also the
// @click handler on the div to detect clicks on the iframe
const handleClickOutsideSearch = () => {
    // don't handle the click outside when the info layer is open
    if (searchStore.isOpenSearch && !mainStore.infoLayerId) {
        searchStore.setIsOpenSearch(false)
    }
}
onClickOutside(searchContainer, handleClickOutsideSearch)
</script>

<template>
    <!-- This div overlay is used to close the search results when clicking outside of the input -->
    <div
        v-if="isSearching"
        class="absolute inset-0 z-0"
        @click="handleClickOutsideSearch"
    ></div>
    <div
        class="fixed top-0 left-0 right-0 pointer-events-none"
        data-cy="div-search-desktop"
    >
        <div ref="searchContainer" class="absolute left-1/2 top-4 z-10 w-[680px] -translate-x-1/2 pointer-events-auto">
            <Card class="w-full">
                <template #content>
                    <SearchInput
                        class="relative z-10"
                        @focus="openSearch"
                    />
                    <SearchKeywordContainer />
                </template>
            </Card>
            <SearchResultsDesktop
                v-if="isSearching"
                class="my-2 h-[620px] w-[680px] gap-4 border border-t-0 border-neutral-300 px-4 pt-4 pb-4 shadow"
            ></SearchResultsDesktop>
        </div>
        <div class="absolute right-6 top-4 pointer-events-auto">
            <LegendButton />
        </div>
    </div>
</template>
