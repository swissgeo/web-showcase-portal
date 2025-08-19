<script setup lang="ts">
import { computed, inject } from 'vue'

import { useSearchStore } from '@/store/search'

import AddressSearchResultEntry from './AddressSearchResultEntry.vue'

const isDesktop = inject<boolean>('isDesktop', true)

const searchStore = useSearchStore()

const hasAddressResults = computed(() => searchStore.searchLocationResults.length > 0)
</script>

<template>
    <ul
        v-if="hasAddressResults"
        class="mt-5 w-full overflow-y-auto p-4"
        :class="{ 'max-h-[65vh]': isDesktop, 'max-h-[calc(80vh-12rem)]': !isDesktop }"
        data-cy="ul-address-search-results"
    >
        <AddressSearchResultEntry
            v-for="result in searchStore.searchLocationResults"
            :key="result.label"
            :result="result"
        />
    </ul>
</template>
