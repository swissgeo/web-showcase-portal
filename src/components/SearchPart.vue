<script setup lang="ts">
import { computed } from 'vue'

import SearchInput from '@/components/SearchInput.vue'
import SearchResults from '@/components/SearchResults.vue'
import { useSearchStore } from '@/store/search'

const searchStore = useSearchStore()

const isSearching = computed(() => !!searchStore.searchTerm)
</script>

<template>
    <div class="fixed left-4 right-4 bottom-8 md:static md:p-8 flex flex-col">
        <SearchResults
            v-if="isSearching"
            class="order-1 md:order-2"
        ></SearchResults>
        <SearchInput class="order-2 md:order-1"></SearchInput>
    </div>
</template>
