<script setup lang="ts">
import { ChevronLeft, PanelLeftClose } from 'lucide-vue-next'
import Button from 'primevue/button'
import Panel from 'primevue/panel'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import SearchFilterDesktop from '@/components/search/SearchFilterDesktop.vue'
import SearchInput from '@/components/search/SearchInput.vue'
import SearchKeywordContainer from '@/components/search/SearchKeywordContainer.vue'
import SearchResultsMobile from '@/components/search/SearchResultsMobile.vue'
import { useMainStore } from '@/store/main'
import { useSearchStore } from '@/store/search'
import { SidebarType, useUiStore } from '@/store/ui'

const { t } = useI18n()

const props = defineProps({
    isDesktopView: {
        type: Boolean,
        default: true,
    },
})

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
</script>

<template>
    <Panel
        v-show="!mainStore.infoLayerId"
        class="h-full"
        :header="t('searchResult.mobileSearchTitle')"
        :pt="{
            root: 'md:rounded-t-none md:shadow-none',
            header: 'md:justify-between justify-center',
            title: 'order-2 md:order-1',
            headerActions: 'absolute left-4 md:static md:order-2',
        }"
        data-cy="div-search-sidebar"
    >
        <template #icons>
            <Button
                v-if="!props.isDesktopView"
                severity="secondary"
                outlined
                class="order-1"
                @click="uiStore.toggleSidebar(SidebarType.SEARCH)"
            >
                <template #icon>
                    <ChevronLeft />
                </template>
            </Button>
            <Button
                v-if="props.isDesktopView"
                severity="secondary"
                size="medium"
                :text="true"
                @click="uiStore.toggleSidebar(SidebarType.SEARCH)"
            >
                <template #icon>
                    <PanelLeftClose />
                </template>
            </Button>
        </template>

        <div class="flex h-full flex-col p-4">
            <!-- Search Input Section -->
            <SearchInput
                class="w-full mb-4"
                @focus="openSearch"
            />

            <SearchKeywordContainer class="mb-4" />

            <SearchFilterDesktop
                v-show="uiStore.isFilterVisible"
                data-cy="search-filter"
                class="bg-swissgeo-lightblue rounded-lg p-4 mb-4"
            />

            <!-- Search Results Button (when not searching) -->
            <Button
                v-if="!isSearching"
                class="w-full mb-4"
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

            <!-- Search Results (when searching) -->
            <SearchResultsMobile
                v-if="isSearching"
                class="min-h-0 flex-1 overflow-y-auto bg-white px-2 pt-4"
                data-cy="comp-search-results-sidebar"
            />
        </div>
    </Panel>
</template>
