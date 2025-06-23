<script setup lang="ts">
import { useSearchStore } from '@/store/search'

import AddressSearchResultEntry from './AddressSearchResultEntry.vue'

const searchStore = useSearchStore()
</script>
<template>
    <ul
        v-if="searchStore.searchLocationResults.length"
        class="mt-5 w-full"
    >
        <AddressSearchResultEntry
            v-for="result in searchStore.searchLocationResults"
            :key="result.label"
            :result="result"
        ></AddressSearchResultEntry>
    </ul>
</template>
