<script lang="ts" setup>
import { computed, ref } from 'vue'

import LegendButton from '@/components/LegendButton.vue'
import SearchInput from '@/components/SearchInput.vue'
import SearchResults from '@/components/SearchResults.vue'
import { useSearchStore } from '@/store/search'

const searchStore = useSearchStore()
const isInputFocused = ref(false)

const isSearching = computed(() => {
    return isInputFocused.value || !!searchStore.searchTerm
})

const openSearch = () => {
    isInputFocused.value = true
}
</script>

<template>
    <div class="fixed top-0 left-0 right-0">
        <div class="flex flex-row items-center justify-center w-full px-6">
            <SearchInput
                class="relative w-1/2 m-auto"
                @focus="openSearch"
                @blur="isInputFocused = false"
            >
                <SearchResults
                    v-if="isSearching"
                    class="absolute left-0 right-0 top-18 min-h-1/3"
                ></SearchResults>
            </SearchInput>
            <LegendButton />
            <!-- maybe here will be the legend icon-->
        </div>
    </div>
</template>
