<script setup lang="ts">
import Card from 'primevue/card'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import IconButton from '@/components/general/IconButton.vue'
import GeolocationButton from '@/components/GeolocationButton.vue'
import LayerCart from '@/components/LayerCart.vue'
import LegendButton from '@/components/LayerWindowButton.vue'
import LogoPic from '@/components/LogoPic.vue'
import GeocatalogTreeButton from '@/components/menu/GeocatalogTreeButton.vue'
import LayerCartButton from '@/components/menu/LayerCartButton.vue'
import SearchFilterMobile from '@/components/search/SearchFilterMobile.vue'
import SearchInput from '@/components/search/SearchInput.vue'
import SearchKeywordContainer from '@/components/search/SearchKeywordContainer.vue'
import SearchResults from '@/components/search/SearchResults.vue'
import TopicTreeBrowser from '@/components/search/TopicTreeBrowser.vue'
import { useResetApp } from '@/composables/useResetAppComposable'
import { useTopicTree } from '@/composables/useTopicTree'
import { useSearchStore } from '@/store/search'
import { useUiStore } from '@/store/ui'

const { t } = useI18n()

const searchStore = useSearchStore()
const uiStore = useUiStore()
const { resetApp } = useResetApp()

const { topicTreeRoot, updateGeocatalogLanguage } = useTopicTree()
const isInputFocused = ref(false)

const isSearching = computed(() => {
    return (isInputFocused.value || !!searchStore.searchTerm) && searchStore.isOpenSearch
})

const openSearch = () => {
    isInputFocused.value = true
    searchStore.setIsOpenSearch(true)
}

const clearSearch = () => {
    isInputFocused.value = false
    searchStore.resetSearch()
}
updateGeocatalogLanguage()
</script>

<template>
    <div
        class="fixed right-0 bottom-0 left-0 flex flex-col place-content-between md:static md:p-8"
        :class="{
            'top-0 bg-white': isSearching,
            'justify-end': !isSearching,
        }"
    >
        <LogoPic
            v-if="!isSearching"
            class="fixed top-4 left-4 rounded bg-white"
            @logo-click="resetApp"
        ></LogoPic>
        <div
            v-if="!isSearching"
            class="fixed top-4 right-4"
        >
            <LegendButton></LegendButton>
        </div>

        <div
            class="flex flex-row items-center justify-between border-b-1 border-gray-300 px-2 py-2"
            :class="{ 'bg-white': isSearching }"
        >
            <div class="flex-column flex w-full items-center justify-between">
                <IconButton
                    v-if="isSearching"
                    class="ml-3 rounded-md border-1 border-gray-300 text-black"
                    aria-label="Back"
                    text
                    data-cy="button-close-search"
                    icon="ChevronLeft"
                    @click="clearSearch"
                >
                </IconButton>
                <div v-else></div>
                <div v-if="isSearching">{{ t('searchResult.mobileSearchTitle') }}</div>
                <LayerCartButton
                    v-if="!uiStore.isLayerCartVisible && isSearching"
                    class=""
                ></LayerCartButton>
            </div>

            <!-- the p-2 is used to make the button works in Pixel 7 or Iphone 14 Pro Max -->
            <div
                v-if="!uiStore.isLayerCartVisible && !isSearching"
                class="flex flex-col gap-2 p-2"
            >
                <GeolocationButton
                    v-if="!uiStore.isLayerCartVisible && !isSearching"
                ></GeolocationButton>
                <LayerCartButton
                    v-if="!uiStore.isLayerCartVisible && !isSearching"
                ></LayerCartButton>
                <GeocatalogTreeButton
                    v-if="!uiStore.isLayerCartVisible && !isSearching"
                ></GeocatalogTreeButton>
            </div>
            <LayerCart
                v-if="uiStore.isLayerCartVisible"
                :is-desktop-view="false"
                class="fixed inset-0 z-50"
            ></LayerCart>
            <TopicTreeBrowser
                v-if="uiStore.isGeocatalogTreeVisible"
                :root="topicTreeRoot"
                :is-desktop-view="false"
                class="fixed inset-0 z-50"
            ></TopicTreeBrowser>
        </div>
        <SearchResults
            v-if="isSearching"
            class="min-w-0 flex-1 grow overflow-y-auto bg-white px-2 pt-4"
            data-cy="comp-search-results-mobile"
        >
        </SearchResults>
        <Card
            class="border border-neutral-300"
            :pt="{
                root: 'rounded-b-none',
                body: 'p-0',
            }"
        >
            <template #content>
                <SearchInput
                    class="px-4 pt-4"
                    @focus="openSearch"
                />
                <SearchKeywordContainer class="px-4" />
                <SearchFilterMobile
                    v-show="uiStore.isFilterVisible"
                    class="bg-swissgeo-lightblue p-4"
                />
            </template>
        </Card>
    </div>
</template>
