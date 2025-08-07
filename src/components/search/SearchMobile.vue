<script setup lang="ts">
import Card from 'primevue/card'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import IconButton from '@/components/general/IconButton.vue'
import LayerCart from '@/components/LayerCart.vue'
import LegendButton from '@/components/LayerWindowButton.vue'
import LogoPic from '@/components/LogoPic.vue'
import LayerCartButton from '@/components/menu/LayerCartButton.vue'
import SearchFilterMobile from '@/components/search/SearchFilterMobile.vue'
import SearchInput from '@/components/search/SearchInput.vue'
import SearchKeywordContainer from '@/components/search/SearchKeywordContainer.vue'
import SearchResultsMobile from '@/components/search/SearchResultsMobile.vue'
import { useResetApp } from '@/composables/useResetAppComposable'
import { useSearchStore } from '@/store/search'
import { useUiStore } from '@/store/ui'

const { t } = useI18n()

const searchStore = useSearchStore()
const uiStore = useUiStore()
const { resetApp } = useResetApp()

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
            class="flex flex-row items-center justify-between px-2 py-4"
            :class="{ 'bg-white': isSearching }"
        >
            <IconButton
                v-if="isSearching"
                aria-label="Back"
                text
                data-cy="button-close-search"
                icon="ArrowLeft"
                @click="clearSearch"
            >
            </IconButton>
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
            class="min-h-0 flex-1 grow-1 overflow-y-scroll bg-white px-2 pt-4 md:overflow-visible"
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
                <SearchKeywordContainer class="px-4" />
                <SearchFilterMobile
                    v-show="uiStore.isFilterVisible"
                    class="bg-swissgeo-lightblue p-4"
                />
            </template>
        </Card>
    </div>
</template>
