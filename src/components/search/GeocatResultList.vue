<script setup lang="ts">
const searchStore = useSearchStore()

import SearchResultEntry from '@/components/search/SearchResultEntry.vue'
import { useSearchStore } from '@/store/search'
</script>
<template>
    <ul
        v-if="searchStore.searchResults.length"
        data-cy="ul-geocat-search-results"
    >
        <SearchResultEntry
            v-for="result in searchStore.searchResults"
            :key="result.uniqueIdentifier"
            :result="result"
        ></SearchResultEntry>
    </ul>
</template>
