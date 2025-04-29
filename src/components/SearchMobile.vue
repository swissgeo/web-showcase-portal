<script setup lang="ts">
import Button from 'primevue/button'
import { computed, ref } from 'vue'

import LayerCartButton from '@/components/LayerCartButton.vue'
import LegendButton from '@/components/LegendButton.vue'
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
        class="fixed bottom-0 left-0 right-0 flex flex-col md:static md:p-8"
        :class="{ 'top-0 justify-stretch': isSearching, 'justify-end': !isSearching }"
    >
        <LogoPic
            v-if="!isSearching"
            class="fixed bg-white rounded top-4 left-4"
        ></LogoPic>
        <div class="fixed top-4 right-4">
            <LegendButton></LegendButton>
        </div>

        <div
            class="flex flex-row justify-between px-2 py-4 border-b border-solid border-neutral-200"
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
            <LayerCartButton></LayerCartButton>
        </div>
        <SearchResults
            v-if="isSearching"
            class="max-h-full px-2 pt-4 grow-1"
        ></SearchResults>
        <SearchInput
            class="bg-white"
            @focus="openSearch"
        ></SearchInput>
    </div>
</template>
