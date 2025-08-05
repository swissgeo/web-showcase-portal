<script setup lang="ts">
import Panel from 'primevue/panel'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import type SearchKeywordContainerType from '@/components/search/SearchKeywordContainer.vue'

import IconButton from '@/components/general/IconButton.vue'
import SearchFilterDesktop from '@/components/search/SearchFilterDesktop.vue'
import SearchInput from '@/components/search/SearchInput.vue'
import SearchKeywordContainer from '@/components/search/SearchKeywordContainer.vue'
import SearchResultsMobile from '@/components/search/SearchResultsMobile.vue'
import { useSearchStore } from '@/store/search'
import { SidebarType, useUiStore } from '@/store/ui'

const { t } = useI18n()

const searchKeywordContainer = ref<InstanceType<typeof SearchKeywordContainerType> | null>(null)

const props = defineProps({
    isDesktopView: {
        type: Boolean,
        default: true,
    },
})

const searchStore = useSearchStore()
const uiStore = useUiStore()

const isInputFocused = ref(false)

const isSearching = computed(() => {
    return (isInputFocused.value || !!searchStore.searchTerm) && searchStore.isOpenSearch
})

const openSearch = () => {
    isInputFocused.value = true
    searchStore.setIsOpenSearch(true)
}

// Handle the SideBar container dragging logic here and pass it on to SearchKeywordContainer
function containerStopDragging() {
    if (searchKeywordContainer.value) {
        searchKeywordContainer.value.containerStopDragging()
    }
}
defineExpose({
    containerStopDragging,
})
</script>

<template>
    <Panel
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
            <IconButton
                v-if="!props.isDesktopView"
                severity="secondary"
                outlined
                class="order-1"
                icon="ChevronLeft"
                @click="uiStore.toggleSidebar(SidebarType.SEARCH)"
            >
            </IconButton>
            <IconButton
                v-if="props.isDesktopView"
                severity="secondary"
                size="medium"
                :text="true"
                icon="PanelLeftClose"
                @click="uiStore.toggleSidebar(SidebarType.SEARCH)"
            >
            </IconButton>
        </template>

        <div class="flex h-full flex-col p-4">
            <!-- Search Input Section -->
            <SearchInput
                class="mb-4 w-full"
                @focus="openSearch"
            />

            <SearchKeywordContainer
                ref="searchKeywordContainer"
                class="mb-4"
            />

            <SearchFilterDesktop
                v-show="uiStore.isFilterVisible"
                data-cy="search-filter"
                class="bg-swissgeo-lightblue mb-4 rounded-lg p-4"
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
