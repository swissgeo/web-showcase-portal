<script lang="ts" setup>
import { computed } from 'vue'

import LegendButton from '@/components/LayerLegendButton.vue'
import SearchInput from '@/components/search/SearchInput.vue'
import SearchResults from '@/components/search/SearchResults.vue'
import { useSearchStore } from '@/store/search'

const searchStore = useSearchStore()

const isOpenSearch = computed(() => searchStore.isOpenSearch)

const isSearching = computed(() => {
    return !!searchStore.searchTerm && isOpenSearch.value
})

const openSearch = () => {
    searchStore.setIsOpenSearch(true)
}
</script>

<template>
    <div class="fixed top-0 right-0 left-0">
        <div class="flex w-full flex-row items-center justify-between px-6">
            <div><!-- empty element to push the others to the middle and right --></div>
            <SearchInput
                class="relative min-w-[680px]"
                @focus="openSearch"
            >
                <SearchResults
                    v-if="isSearching"
                    class="absolute top-20 right-5 left-5 h-[620px] min-h-1/3 border border-t-0 border-neutral-300 pt-4 shadow"
                ></SearchResults>
            </SearchInput>
            <div>
                <LegendButton />
            </div>
        </div>
    </div>
</template>
