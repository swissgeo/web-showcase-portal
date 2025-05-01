<script setup lang="ts">
import Button from 'primevue/button'
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

const clearSearch = () => {
    isInputFocused.value = false
    searchStore.clear()
}
</script>

<template>
    <div
        class="fixed right-0 bottom-0 left-0 flex flex-col md:static md:p-8"
        :class="{ 'top-0 justify-stretch': isSearching, 'justify-end': !isSearching }"
    >
        <!-- in mobile mode, we fixate it to the top-->
        <!-- in desktop mode, we take it in the header -->
        <LogoPic
            v-if="!isSearching"
            class="fixed top-4 left-4 rounded-2xl bg-white"
        ></LogoPic>
        <div
            class="flex flex-row justify-between border-b border-solid border-neutral-200 px-2 py-4"
            :class="{ 'bg-white': isSearching }"
        >
            <Button
                v-if="isSearching"
                icon="pi pi-arrow-left"
                size="small"
                severity="secondary"
                @click="clearSearch"
            ></Button>
            <div v-else></div>
            <div v-if="isSearching">Search</div>
            <LayerCart class=""></LayerCart>
        </div>
        <SearchResults
            v-if="isSearching"
            class="max-h-full grow-1 px-2 pt-4"
        ></SearchResults>
        <SearchInput
            class="bg-white"
            @focus="openSearch"
        ></SearchInput>
    </div>
</template>
