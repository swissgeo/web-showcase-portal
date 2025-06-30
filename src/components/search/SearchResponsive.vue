<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import Button from 'primevue/button'
import Card from 'primevue/card'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import LayerCart from '@/components/LayerCart.vue'
import LayerCartButton from '@/components/LayerCartButton.vue'
import LegendButton from '@/components/LayerLegendButton.vue'
import LogoPic from '@/components/LogoPic.vue'
import SearchFilterMobile from '@/components/search/SearchFilterMobile.vue'
import SearchInput from '@/components/search/SearchInput.vue'
import SearchKeywordContainer from '@/components/search/SearchKeywordContainer.vue'
import SearchResultsMobile from '@/components/search/SearchResultsMobile.vue'
import { useMainStore } from '@/store/main'
import { useSearchStore } from '@/store/search'
import { useUiStore } from '@/store/ui'
import { isFirefoxMobile } from '@/utils/browser'

interface Props {
    isSidebar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    isSidebar: false
})

const { t } = useI18n()

const isFFMobile = isFirefoxMobile()

const searchStore = useSearchStore()
const uiStore = useUiStore()
const mainStore = useMainStore()

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
</script>

<template>
    <div
        v-show="!mainStore.infoLayerId"
        :class="props.isSidebar 
            ? 'flex h-full flex-col p-4' 
            : 'fixed right-0 bottom-0 left-0 flex flex-col place-content-between md:static md:p-8'"
        class="sidebar-mobile-search"
        :style="props.isSidebar ? {} : {
            'top': isSearching ? '0' : 'auto',
            'background-color': isSearching ? 'white' : 'transparent',
            'bottom': isFFMobile && isSearching ? '2.5rem' : (isSearching ? 'auto' : '0'),
            'justify-content': !isSearching ? 'flex-end' : 'space-between'
        }"
    >
        <!-- Logo and Legend - only show in mobile mode, not sidebar -->
        <LogoPic
            v-if="!isSearching && !props.isSidebar"
            class="fixed top-4 left-4 rounded bg-white"
        ></LogoPic>
        <div
            v-if="!isSearching && !props.isSidebar"
            class="fixed top-4 right-4"
        >
            <LegendButton></LegendButton>
        </div>

        <!-- Header/Navigation Bar - different layout for sidebar vs mobile -->
        <div
            v-if="props.isSidebar && isSearching"
            class="mb-2 flex justify-between items-center"
        >
            <h3 class="text-lg font-semibold">{{ t('searchResult.title', { count: searchStore.searchResultTotal }) }}</h3>
            <Button
                size="small"
                icon="pi pi-times"
                :pt="{
                    root: 'border-gray-300 bg-white shadow-sm hover:bg-gray-100',
                    icon: 'text-gray-600',
                }"
                @click="clearSearch"
            />
        </div>
        <div
            v-else-if="!props.isSidebar"
            class="flex flex-row items-center justify-between px-2 py-4"
            :class="{ 'bg-white': isSearching }"
        >
            <Button
                v-if="isSearching"
                aria-label="Back"
                text
                data-cy="button-close-search"
                @click="clearSearch"
            >
                <template #icon>
                    <ArrowLeft />
                </template>
            </Button>
            <div v-else></div>
            <div v-if="isSearching">{{ t('searchResult.mobileSearchTitle') }}</div>
            <LayerCartButton v-if="!uiStore.isLayerCartVisible"></LayerCartButton>
            <LayerCart
                v-if="uiStore.isLayerCartVisible"
                :is-desktop-view="false"
                class="fixed inset-0 z-50"
            ></LayerCart>
        </div>

        <!-- Search Results - different styling for sidebar vs mobile -->
        <SearchResultsMobile
            v-if="isSearching"
            :class="props.isSidebar 
                ? 'h-full overflow-y-auto border border-neutral-300 rounded p-2 flex-1' 
                : 'min-h-0 flex-1 grow-1 overflow-y-scroll bg-white px-2 pt-4 md:overflow-visible'"
            data-cy="comp-search-results-mobile"
        >
        </SearchResultsMobile>

        <!-- Search Results Button (when not searching) - only for sidebar -->
        <div v-if="!isSearching && props.isSidebar" class="mb-4">
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

        <!-- Search Input Card - different positioning for sidebar vs mobile -->
        <Card
            :class="props.isSidebar ? '' : 'border border-neutral-300'"
            :pt="props.isSidebar ? {
                body: 'p-0'
            } : {
                root: 'rounded-b-none',
                body: 'p-0',
            }"
        >
            <template #content>
                <SearchInput
                    :class="props.isSidebar ? 'w-full' : 'px-4 pt-4'"
                    @focus="openSearch"
                />
                <SearchKeywordContainer :class="props.isSidebar ? '' : 'px-4'" />
                <SearchFilterMobile
                    v-show="uiStore.isFilterVisible"
                    :class="props.isSidebar 
                        ? 'bg-swissgeo-lightblue rounded-lg p-4' 
                        : 'bg-swissgeo-lightblue p-4'"
                />
            </template>
        </Card>
    </div>
</template>
