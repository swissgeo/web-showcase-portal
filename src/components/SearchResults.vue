<script setup lang="ts">
import SearchResultEntry from '@/components/SearchResultEntry.vue'
import { useSearchStore } from '@/store/search'

const searchStore = useSearchStore()
</script>

<template>
    <div class="overflow-auto bg-white">
        <ul
            v-if="searchStore.searchResults.length"
            class="overflow-y-auto"
            data-cy="ul-search-results"
        >
            <SearchResultEntry
                v-for="result in searchStore.searchResults"
                :key="result.uniqueIdentifier"
                :result="result"
            ></SearchResultEntry>
        </ul>
        <div
            v-else
            class="p-8"
        >
            Maybe topics or stuff, TBD
        </div>
    </div>
</template>
