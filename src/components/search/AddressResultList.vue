<script setup lang="ts">
import { useSearchStore } from '@/store/search'

import AddressSearchResultEntry from './AddressSearchResultEntry.vue'

const searchStore = useSearchStore()
</script>
<template>
    <ul
        v-if="searchStore.searchLocationResults.length"
        class="md:mt-5"
    >
        <AddressSearchResultEntry
            v-for="result in searchStore.searchLocationResults"
            :key="result.label"
            :result="result"
        ></AddressSearchResultEntry>
    </ul>
</template>
