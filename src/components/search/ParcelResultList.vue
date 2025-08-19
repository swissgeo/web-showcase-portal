<script setup lang="ts">
import { inject, ref, computed, type Ref } from 'vue'

import { useSearchStore } from '@/store/search'

import ParcelSearchResultEntry from './ParcelSearchResultEntry.vue'

const isDesktop = inject<Ref<boolean>>('isDesktop', ref(true))
const searchStore = useSearchStore()

const hasParcelResults = computed(() => searchStore.searchParcelResults.length > 0)
</script>

<template>
    <ul
        v-if="hasParcelResults"
        class="mt-5 w-full overflow-y-auto p-4"
        :class="{ 'max-h-[65vh]': isDesktop, 'max-h-[calc(80vh-12rem)]': !isDesktop }"
        data-cy="ul-parcel-search-results"
    >
        <ParcelSearchResultEntry
            v-for="result in searchStore.searchParcelResults"
            :key="result.label"
            :result="result"
        />
    </ul>
</template>
