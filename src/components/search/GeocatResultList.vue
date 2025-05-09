<script setup lang="ts">
const searchStore = useSearchStore()

import SearchResultEntry from '@/components/search/GeocatSearchResultEntry.vue'
import { useSearchStore } from '@/store/search'
</script>
<template>
    <ul
        v-if="searchStore.searchResults.length"
        data-cy="ul-geocat-search-results"
        class="md:mt-5"
    >
        <SearchResultEntry
            v-for="result in searchStore.searchResults"
            :key="result.uniqueIdentifier"
            :result="result"
        ></SearchResultEntry>
    </ul>
</template>
