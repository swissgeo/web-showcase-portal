<script setup lang="ts">
import { useSearchStore } from '@/store/search'

import AddressSearchResultEntry from './AddressSearchResultEntry.vue'

const searchStore = useSearchStore()
</script>
<template>
    <template v-if="searchStore.searchLocationResults.length">
        <div class="m-4 flex flex-wrap items-center gap-2">
            <span class="text-sm font-bold">Addresses</span>
            <span
                class="rounded-full bg-gray-600 px-2 py-1 text-sm text-xs font-semibold text-white"
            >
                {{ searchStore.searchLocationResults.length }}
            </span>
        </div>
        <AddressSearchResultEntry
            v-for="result in searchStore.searchLocationResults"
            :key="result.label"
            :result="result"
        ></AddressSearchResultEntry>
    </template>
</template>
