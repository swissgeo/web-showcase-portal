<script setup lang="ts">
import RemovableTag from '@/components/general/RemovableTag.vue'
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

const removeFederalTag = (index: number) => {
    selectedFederal.value = selectedFederal.value.filter((_, idx) => idx !== index)
}

const removeCantonalTag = (index: number) => {
    selectedCantonal.value = selectedCantonal.value.filter((_, idx) => idx !== index)
}

const removeCommunalTag = (index: number) => {
    selectedCommunal.value = selectedCommunal.value.filter((_, idx) => idx !== index)
}
</script>

<template>
    <div
        v-if="selectedFederal.length || selectedCantonal.length || selectedCommunal.length"
        class="flex flex-wrap gap-2 pt-2"
    >
        <RemovableTag
            v-for="(id, idx) in selectedFederal"
            :key="'federal-' + id"
            severity="secondary"
            :value="findGroupLabel(federalGroups, id)"
            class="font-bold"
            @remove="removeFederalTag(idx)"
        />
        <RemovableTag
            v-for="(id, idx) in selectedCantonal"
            :key="'cantonal-' + id"
            severity="secondary"
            :value="findGroupLabel(cantonGroups, id)"
            class="font-bold"
            @remove="removeCantonalTag(idx)"
        />
        <RemovableTag
            v-for="(id, idx) in selectedCommunal"
            :key="'communal-' + id"
            severity="secondary"
            :value="findGroupLabel(communalGroups, id)"
            class="font-bold"
            @remove="removeCommunalTag(idx)"
        />
    </div>
</template>
