<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import MobileFullScreenMultiSelect from '@/components/search/MobileFullScreenMultiSelect.vue'
import { useSearchFilter } from '@/search/searchFilter.composable'

const { t } = useI18n()
const {
    federalGroups,
    cantonGroups,
    communalGroups,
    selectedFederal,
    selectedCantonal,
    selectedCommunal,
} = useSearchFilter()
</script>

<template>
    <div class="mt-2 flex w-full items-center overflow-x-auto">
        <MobileFullScreenMultiSelect
            v-model="selectedFederal"
            :options="federalGroups"
            :placeholder="t('organisation.category.federation')"
            :label-key="'label'"
        />
        <MobileFullScreenMultiSelect
            v-model="selectedCantonal"
            :options="cantonGroups"
            :placeholder="t('organisation.category.canton')"
            :label-key="'label'"
        />
        <MobileFullScreenMultiSelect
            v-model="selectedCommunal"
            :options="communalGroups"
            :placeholder="t('organisation.category.commune')"
            :label-key="'label'"
        />
    </div>
</template>
