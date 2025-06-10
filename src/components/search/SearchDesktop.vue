<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'
import Button from 'primevue/button'
import Card from 'primevue/card'
import { computed, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'

import LegendButton from '@/components/LayerLegendButton.vue'
import SearchFilter from '@/components/search/SearchFilter.vue'
import SearchInput from '@/components/search/SearchInput.vue'
import SearchKeywordContainer from '@/components/search/SearchKeywordContainer.vue'
import SearchResultsDesktop from '@/components/search/SearchResultsDesktop.vue'
import { useSearchStore } from '@/store/search'

const searchContainer = useTemplateRef<HTMLElement>('searchContainer')

const { t } = useI18n()
const searchStore = useSearchStore()
const isOpenSearch = computed(() => searchStore.isOpenSearch)
const searchTerm = computed(() => searchStore.searchTerm)

const isSearching = computed(() => !!searchTerm.value && isOpenSearch.value)

const openSearch = () => {
    searchStore.setIsOpenSearch(true)
}

const closeSearch = () => {
    searchStore.setIsOpenSearch(false)
}

// To correctly close the search results when clicking outside of the search input or the search results
// we need to use the onClickOutside function from vueuse (to detect clicks on elements of this website) but also the
// @click handler on the div to detect clicks on the iframe
const handleClickOutsideSearch = (event: MouseEvent) => {
    // close the search results if the user clicks outside of the search input,
    // outside of the info panel, and outside of the search filter (including its children)
    const target = event.target as HTMLElement
    const clickedInsideInfoPanel = !!target.closest('[data-cy="div-dataset-detail-panel"]')
    const clickedInsideSearchFilter = !!document
        .querySelector('[data-cy="search-filter"]')
        ?.contains(target)
    if (searchStore.isOpenSearch && !clickedInsideInfoPanel && !clickedInsideSearchFilter) {
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
    <div class="pointer-events-none fixed top-0 right-0 left-0">
        <div
            ref="searchContainer"
            class="pointer-events-auto absolute top-4 left-1/2 z-10 w-[680px] -translate-x-1/2"
            data-cy="div-search-desktop"
        >
            <Card class="w-full">
                <template #content>
                    <SearchInput
                        class="relative z-10"
                        @focus="openSearch"
                    />
                    <SearchKeywordContainer />
                    <SearchFilter data-cy="search-filter" />
                </template>
            </Card>
            <SearchResultsDesktop
                v-if="isSearching"
                class="my-2 h-[620px] w-[680px] gap-4 border border-t-0 border-neutral-300 px-4 pt-4 pb-4 shadow"
            ></SearchResultsDesktop>
            <Button
                v-if="!isSearching"
                class="background-white relative left-1/2 my-2 inline-block w-auto -translate-x-1/2 text-sm"
                :label="t('searchResult.buttonLabel')"
                :badge="searchStore.searchResultTotal.toString()"
                :pt="{
                    root: 'border-gray-300 bg-white shadow-md hover:bg-gray-100 hover:shadow-lg text-black font-semibold',
                    label: 'text-bold text-[#1C6B85] font-semibold mr-2',
                    pcBadge: {
                        root: 'text-black font-semibold bg-[#D3E0E4]',
                    },
                }"
                @click="openSearch"
            >
            </Button>
            <Button
                v-else
                class="background-white relative left-1/2 inline-block w-auto -translate-x-1/2 -translate-y-2/3 p-2 text-sm"
                icon="pi pi-angle-up"
                :pt="{
                    root: 'border-[#1C6B85] bg-white shadow-md hover:bg-gray-100 hover:shadow-lg',
                    label: 'hidden',
                    icon: 'text-[#1C6B85]',
                }"
                @click="closeSearch"
            >
            </Button>
        </div>
        <div class="pointer-events-auto absolute top-4 right-6">
            <LegendButton />
        </div>
    </div>
</template>
