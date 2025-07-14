<script setup lang="ts">
import { useSearchStore } from '@/store/search'

import ParcelSearchResultEntry from './ParcelSearchResultEntry.vue'

const searchStore = useSearchStore()
</script>
<template>
    <ul
        v-if="searchStore.searchParcelResults.length"
        class="mt-5 w-full"
        data-cy="ul-parcel-search-results"
    >
        <ParcelSearchResultEntry
            v-for="result in searchStore.searchParcelResults"
            :key="result.label"
            :result="result"
        ></ParcelSearchResultEntry>
    </ul>
</template>
