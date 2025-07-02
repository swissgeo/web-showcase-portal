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
        class="fixed right-0 bottom-0 left-0 flex flex-col place-content-between lg:static lg:p-8"
        :class="{
            'top-0 bg-white': isSearching,
            'bottom-10': isFFMobile && isSearching,
            'justify-end': !isSearching,
        }"
    >
        <LogoPic
            v-if="!isSearching"
            class="fixed top-4 left-4 rounded bg-white"
        ></LogoPic>
        <div
            v-if="!isSearching"
            class="fixed top-4 right-4"
        >
            <LegendButton></LegendButton>
        </div>

        <div
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
        <SearchResultsMobile
            v-if="isSearching"
            class="min-h-0 flex-1 grow-1 overflow-y-scroll bg-white px-2 pt-4 lg:overflow-visible"
            data-cy="comp-search-results-mobile"
        >
        </SearchResultsMobile>
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
                <SearchKeywordContainer class="px-4 py-2" />
                <SearchFilterMobile
                    v-show="uiStore.isFilterVisible"
                    class="bg-swissgeo-lightblue p-4"
                />
            </template>
        </Card>
    </div>
</template>
