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
        class="fixed left-0 right-0 bottom-0 md:static md:p-8 flex flex-col"
        :class="{ 'justify-stretch top-0': isSearching, 'justify-end': !isSearching }"
    >
        <!-- in mobile mode, we fixate it to the top-->
        <!-- in desktop mode, we take it in the header -->
        <LogoPic
            v-if="!isSearching"
            class="fixed top-4 left-4 bg-white rounded-2xl"
        ></LogoPic>
        <div
            class="flex flex-row justify-between py-4 px-2 border-b border-solid border-neutral-200"
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
            class="max-h-full grow-1 pt-4 px-2"
        ></SearchResults>
        <SearchInput
            class="bg-white"
            @focus="openSearch"
        ></SearchInput>
    </div>
</template>
