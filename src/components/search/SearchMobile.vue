<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'
import Button from 'primevue/button'
import Card from 'primevue/card'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import LayerCart from '@/components/LayerCart.vue'
import LayerCartButton from '@/components/LayerCartButton.vue'
import LegendButton from '@/components/LayerLegendButton.vue'
import LogoPic from '@/components/LogoPic.vue'
import SearchInput from '@/components/search/SearchInput.vue'
import SearchKeywordContainer from '@/components/search/SearchKeywordContainer.vue'
import SearchResultsMobile from '@/components/search/SearchResultsMobile.vue'
import { useMainStore } from '@/store/main'
import { useSearchStore } from '@/store/search'
import { useUiStore } from '@/store/ui'

const { t } = useI18n()

const searchStore = useSearchStore()
const uiStore = useUiStore()
const mainStore = useMainStore()

const isInputFocused = ref(false)

const isSearching = computed(() => {
    return isInputFocused.value || !!searchStore.searchTerm
})

const openSearch = () => {
    isInputFocused.value = true
}

const clearSearch = () => {
    isInputFocused.value = false
    searchStore.$reset()
}
</script>

<template>
    <div
        v-show="!mainStore.infoLayerId"
        class="fixed right-0 bottom-0 left-0 flex flex-col place-content-between md:static md:p-8"
        :class="{ 'top-0 bg-white': isSearching, 'justify-end': !isSearching }"
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
                outlined
                severity="secondary"
                data-cy="button-close-search"
                @click="clearSearch"
            >
                <template #icon>
                    <ChevronLeft />
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
            class="min-h-0 flex-1 grow-1 overflow-hidden bg-white px-2 pt-4 md:overflow-visible"
        >
        </SearchResultsMobile>
        <Card
            class="border border-neutral-300"
            :pt="{
                root: 'rounded-b-none',
                body: 'p-4',
            }"
        >
            <template #content>
                <SearchInput @focus="openSearch" />
                <SearchKeywordContainer />
            </template>
        </Card>
    </div>
</template>
