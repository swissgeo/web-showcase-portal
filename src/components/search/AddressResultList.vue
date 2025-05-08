<script setup lang="ts">
import { useSearchStore } from '@/store/search'

import AddressSearchResultEntry from './AddressSearchResultEntry.vue'

const searchStore = useSearchStore()
</script>
<template>
    <template v-if="searchStore.searchLocationResults.length">
        <AddressSearchResultEntry
            v-for="result in searchStore.searchLocationResults"
            :key="result.label"
            :result="result"
        ></AddressSearchResultEntry>
    </template>
</template>
