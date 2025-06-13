<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'
import Button from 'primevue/button'
import Card from 'primevue/card'
import { computed, useTemplateRef, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import { fetchTopicCatalogJson } from '@/api/topics.api'
import LegendButton from '@/components/LayerLegendButton.vue'
import SearchFilter from '@/components/search/SearchFilterDesktop.vue'
import SearchInput from '@/components/search/SearchInput.vue'
import SearchKeywordContainer from '@/components/search/SearchKeywordContainer.vue'
import SearchResultsDesktop from '@/components/search/SearchResultsDesktop.vue'
import TopicTreeBrowser from '@/components/search/TopicTreeBrowser.vue'
import { useGeocatalogStore } from '@/store/geocatalog'
import { useSearchStore } from '@/store/search'
import { type TopicTreeNode } from '@/types/geocatalog'

const searchContainer = useTemplateRef<HTMLElement>('searchContainer')

const { t } = useI18n()
const searchStore = useSearchStore()

const isOpenSearch = computed(() => searchStore.isOpenSearch)
const searchTerm = computed(() => searchStore.searchTerm)

const isSearching = computed(() => !!searchTerm.value && isOpenSearch.value)
const isCatalogShown = computed(() => !searchTerm.value && isOpenSearch.value)

const geocatalogStore = useGeocatalogStore()

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
    const clickedInsideSearchFilter = !!target.closest('[data-cy="multiselect-filter-list"]')
    if (searchStore.isOpenSearch && !clickedInsideInfoPanel && !clickedInsideSearchFilter) {
        searchStore.setIsOpenSearch(false)
    }
}

onClickOutside(searchContainer, handleClickOutsideSearch)

onMounted(async () => {
    const topic = 'ech';
    const lang = 'en';
    let root = geocatalogStore.getTopicTreeRoot(topic, lang);
    if (!root) {
        const data = await fetchTopicCatalogJson(topic, lang);
        root = (data as { results?: { root?: TopicTreeNode } })?.results?.root || null;
        geocatalogStore.setTopicTreeRoot(topic, lang, root);
    }
})
</script>

<template>
    <!-- This div overlay is used to close the search results when clicking outside of the input -->
    <div
        v-if="isOpenSearch"
        class="absolute inset-0 z-0"
        @click="handleClickOutsideSearch"
    ></div>
    <div class="pointer-events-none fixed top-0 right-0 left-0">
        <div
            ref="searchContainer"
            class="pointer-events-auto absolute top-4 left-1/2 z-10 w-[680px] -translate-x-1/2"
            data-cy="div-search-desktop"
        >
            <Card
                class="4px w-full border-2 border-[#1F576B]"
                :pt="{
                    body: 'p-0',
                }"
            >
                <template #content>
                    <SearchInput
                        class="relative z-10 px-4 pt-3"
                        @focus="openSearch"
                    />
                    <SearchKeywordContainer class="mb-5 px-4 pt-4" />
                    <SearchFilter
                        data-cy="search-filter"
                        class="bg-swissgeo-lightblue rounded-b-lg p-4"
                    />
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
                    label: 'text-bold text-swissgeo-blue font-semibold mr-2',
                    pcBadge: {
                        root: 'text-black font-semibold bg-swissgeo-lightblue',
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
                    root: 'border-swissgeo-blue bg-white shadow-md hover:bg-gray-100 hover:shadow-lg',
                    label: 'hidden',
                    icon: 'text-swissgeo-blue',
                }"
                @click="closeSearch"
            >
            </Button>
            <div
                v-if="geocatalogStore.getTopicTreeRoot('ech', 'en') && isCatalogShown"
                class="absolute top-full left-0 z-20 my-2 h-[620px] w-[680px] gap-4 border border-t-0 border-neutral-300 bg-white px-4 pt-4 pb-4 shadow"
                style="min-height: 200px"
            >
                <TopicTreeBrowser :root="geocatalogStore.getTopicTreeRoot('ech', 'en')" />
            </div>
        </div>
        <div class="pointer-events-auto absolute top-4 right-6">
            <LegendButton />
        </div>
    </div>
</template>
