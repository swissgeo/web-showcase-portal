<script setup lang="ts">
import SearchInput from '@/components/SearchInput.vue'
import SearchResults from '@/components/SearchResults.vue'
</script>

<template>
    <div class="fixed bg-white left-4 right-4 top-8 md:static md:p-8">
        <SearchInput></SearchInput>
        <SearchResults></SearchResults>
    </div>
</template>
