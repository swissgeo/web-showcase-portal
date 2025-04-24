<script lang="ts" setup>
import { computed, ref } from 'vue'

import LayerCart from '@/components/LayerCart.vue'
import LogoPic from '@/components/LogoPic.vue'
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
    <div class="">
            <LogoPic class="ml-8 mt-6"></LogoPic>
        <div class="flex flex-row justify-between w-full items-center px-6">
            <SearchInput
                class="w-1/2 relative"
                @focus="openSearch"
                @blur="isInputFocused = false"
            >
                <SearchResults
                    v-if="isSearching"
                    class="absolute top-18 left-0 right-0 min-h-1/3"
                ></SearchResults>
            </SearchInput>
            <LayerCart></LayerCart>
        </div>
    </div>
</template>
