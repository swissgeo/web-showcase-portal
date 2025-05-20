<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'
import { computed, useTemplateRef } from 'vue'

import LegendButton from '@/components/LayerLegendButton.vue'
import SearchInput from '@/components/search/SearchInput.vue'
import SearchResults from '@/components/search/SearchResults.vue'
import { useMainStore } from '@/store/main'
import { useSearchStore } from '@/store/search'

const searchInput = useTemplateRef<HTMLElement>('searchInput')

const searchStore = useSearchStore()
const mainStore = useMainStore()
const isOpenSearch = computed(() => searchStore.isOpenSearch)

const isSearching = computed(() => {
    return !!searchStore.searchTerm && isOpenSearch.value
})

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
onClickOutside(searchInput, handleClickOutsideSearch)
</script>

<template>
    <!-- This div overlay is used to close the search results when clicking outside of the input -->
    <div
        v-if="isSearching"
        class="absolute inset-0 z-0"
        @click="handleClickOutsideSearch"
    ></div>
    <div
        class="fixed top-0 right-0 left-0"
        data-cy="div-search-desktop"
    >
        <div class="flex w-full flex-row items-center justify-between px-6">
            <div><!-- empty element to push the others to the middle and right --></div>
            <SearchInput
                ref="searchInput"
                class="relative z-10 min-w-[680px]"
                @focus="openSearch"
            >
                <SearchResults
                    v-if="isSearching"
                    class="my-2 h-[620px] min-h-1/3 w-[680px] border border-t-0 border-neutral-300 pt-4 shadow"
                ></SearchResults>
            </SearchInput>
            <div>
                <LegendButton />
            </div>
        </div>
    </div>
</template>
