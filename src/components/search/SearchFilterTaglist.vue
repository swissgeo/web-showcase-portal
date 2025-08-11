<script setup lang="ts">
import Tag from 'primevue/tag'

import { useSearchFilter } from '@/search/searchFilter.composable'

const {
    findGroupLabel,
    federalGroups,
    cantonGroups,
    communalGroups,
    selectedFederal,
    selectedCantonal,
    selectedCommunal,
} = useSearchFilter()
</script>

<template>
    <div
        v-if="selectedFederal.length || selectedCantonal.length || selectedCommunal.length"
        class="flex flex-wrap gap-2 pt-2"
    >
        <Tag
            v-for="id in selectedFederal"
            :key="'federal-' + id"
            severity="danger"
            :value="findGroupLabel(federalGroups, id)"
            class="font-bold"
            removable
            @remove="selectedFederal = []"
        />
        <Tag
            v-for="id in selectedCantonal"
            :key="'cantonal-' + id"
            severity="info"
            :value="findGroupLabel(cantonGroups, id)"
            class="font-bold"
            removable
            @remove="selectedCantonal = []"
        />
        <Tag
            v-for="id in selectedCommunal"
            :key="'communal-' + id"
            severity="success"
            :value="findGroupLabel(communalGroups, id)"
            class="font-bold"
            removable
            @remove="selectedCommunal = []"
        />
    </div>
</template>
