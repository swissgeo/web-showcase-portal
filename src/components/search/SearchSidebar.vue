<script lang="ts" setup>
import Button from 'primevue/button'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import SearchFilter from '@/components/search/SearchFilterDesktop.vue'
import SearchInput from '@/components/search/SearchInput.vue'
import SearchKeywordContainer from '@/components/search/SearchKeywordContainer.vue'
import SearchResultsDesktop from '@/components/search/SearchResultsDesktop.vue'
import { useSearchStore } from '@/store/search'
import { useUiStore } from '@/store/ui'

const { t } = useI18n()
const searchStore = useSearchStore()
const uiStore = useUiStore()

const isOpenSearch = computed(() => searchStore.isOpenSearch)
const searchTerm = computed(() => searchStore.searchTerm)

const isSearching = computed(() => !!searchTerm.value && isOpenSearch.value)

const openSearch = () => {
    searchStore.setIsOpenSearch(true)
}

const closeSearch = () => {
    searchStore.setIsOpenSearch(false)
}
</script>

<template>
    <div class="flex h-full flex-col p-4" data-cy="div-search-sidebar">
        <!-- Search Input Section -->
        <div class="mb-4">
            <SearchInput
                class="w-full"
                @focus="openSearch"
            />
        </div>

        <!-- Search Keywords -->
        <div class="mb-4">
            <SearchKeywordContainer />
        </div>

        <!-- Search Filter -->
        <div
            v-show="uiStore.isFilterVisible"
            class="mb-4"
        >
            <SearchFilter
                data-cy="search-filter"
                class="bg-swissgeo-lightblue rounded-lg p-4"
            />
        </div>

        <!-- Search Results Button (when not searching) -->
        <div v-if="!isSearching" class="mb-4">
            <Button
                class="w-full"
                :label="t('searchResult.buttonLabel')"
                :badge="searchStore.searchResultTotal.toString()"
                :pt="{
                    root: 'border-gray-300 bg-white shadow-md hover:bg-gray-100 hover:shadow-lg text-black font-semibold justify-center',
                    label: 'text-bold text-swissgeo-blue font-semibold mr-2',
                    pcBadge: {
                        root: 'text-black font-semibold bg-swissgeo-lightblue',
                    },
                }"
                @click="openSearch"
            />
        </div>

        <!-- Search Results (when searching) -->
        <div
            v-if="isSearching"
            class="flex-1 min-h-0"
        >
            <div class="mb-2 flex justify-between items-center">
                <h3 class="text-lg font-semibold">{{ t('searchResult.title', { count: searchStore.searchResultTotal }) }}</h3>
                <Button
                    size="small"
                    icon="pi pi-times"
                    :pt="{
                        root: 'border-gray-300 bg-white shadow-sm hover:bg-gray-100',
                        icon: 'text-gray-600',
                    }"
                    @click="closeSearch"
                />
            </div>
            <SearchResultsDesktop
                class="h-full overflow-y-auto border border-neutral-300 rounded p-2"
            />
        </div>
    </div>
</template>
