<script setup lang="ts">
import { inject } from 'vue'

import SearchResultsDesktop from '@/components/search/SearchResultsDesktop.vue'
import SearchResultsMobile from '@/components/search/SearchResultsMobile.vue'

const isDesktop = inject('isDesktop')
</script>

<template>
    <div class="overflow-hidden bg-white md:overflow-visible">
        <SearchResultsDesktop
            v-if="isDesktop"
            class="h-full gap-4 px-4 pb-4"
        ></SearchResultsDesktop>
        <SearchResultsMobile
            v-else
            class="h-full min-h-0 flex-1 overflow-hidden"
        >
        </SearchResultsMobile>
    </div>
</template>
