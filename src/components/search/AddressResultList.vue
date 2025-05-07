<script setup lang="ts">
const searchStore = useSearchStore()

import { useSearchStore } from '@/store/search'
</script>
<template>
    <span v-if="searchStore.searchLocationResults.length > 0"
        >Addresses {{ searchStore.searchLocationResults.length }}</span
    >
    <ul
        v-if="searchStore.searchLocationResults.length"
        class=""
        data-cy="ul-search-results "
    >
        <div
            v-for="result in searchStore.searchLocationResults"
            :key="result.id"
        >
            <p v-html="result?.label"></p>
        </div>
    </ul>
</template>
