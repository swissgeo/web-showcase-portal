<script setup lang="ts">
import MultiSelect from 'primevue/multiselect'
import Tag from 'primevue/tag'
import { useI18n } from 'vue-i18n'

import type { FilterGroup } from '@/types/search'

import { useSearchFilter } from '@/search/searchFilter.composable'

const { t } = useI18n()
const {
    findGroupLabel,
    filterLabelKey,
    federalGroups,
    cantonGroups,
    communalGroups,
    selectedFederal,
    selectedCantonal,
    selectedCommunal,
} = useSearchFilter()

const emit = defineEmits(['focus', 'blur'])

const { isShowTags = true } = defineProps<{
    isShowTags?: boolean
}>()

function multiSelectLabel(selectedValues: number[], groups: FilterGroup[]): string {
    return selectedValues
        .map((id) => groups.find((g) => g.value === id)?.label)
        .filter(Boolean)
        .join(', ')
}
</script>

<template>
    <div class="bg-swissgeo-lightblue p-3">
        <span class="text-sm">{{ t('filter.filterByProvider') }}</span>
        <div class="flex w-full items-center">
            <MultiSelect
                v-model="selectedFederal"
                :max-selected-labels="0"
                :checkbox-style-class="'!border-gray-300 !bg-white !text-gray-900'"
                :checkbox-icon="'pi pi-check'"
                :filter="true"
                :filter-placeholder="t('organisation.selectFederal')"
                :filter-by="filterLabelKey"
                :show-select-all="false"
                :options="federalGroups"
                option-label="label"
                option-value="value"
                :placeholder="t('organisation.selectFederal')"
                show-clear
                class="mr-2 min-w-[100px] flex-1 text-xs"
                :pt="{
                    overlay: { 'data-cy': 'multiselect-filter-list' },
                    label: {
                        class: 'block truncate max-w-[21ch]',
                    },
                }"
                :selected-items-label="
                    t('organisation.category.federal_office') +
                    ': ' +
                    multiSelectLabel(selectedFederal, federalGroups)
                "
                @focus="emit('focus')"
                @blur="emit('blur')"
            >
            </MultiSelect>
            <MultiSelect
                v-model="selectedCantonal"
                :max-selected-labels="0"
                :checkbox-style-class="'!border-gray-300 !bg-white !text-gray-900'"
                :checkbox-icon="'pi pi-check'"
                :filter="true"
                :filter-placeholder="t('organisation.selectCanton')"
                :filter-by="filterLabelKey"
                :show-select-all="false"
                :options="cantonGroups"
                option-label="label"
                option-value="value"
                :placeholder="t('organisation.selectCanton')"
                show-clear
                class="mr-2 min-w-[100px] flex-1 text-xs"
                :pt="{
                    overlay: { 'data-cy': 'multiselect-filter-list' },
                }"
                :selected-items-label="
                    t('organisation.category.canton') +
                    ': ' +
                    multiSelectLabel(selectedCantonal, cantonGroups)
                "
                @focus="emit('focus')"
                @blur="emit('blur')"
            >
            </MultiSelect>
            <MultiSelect
                v-model="selectedCommunal"
                :max-selected-labels="0"
                :checkbox-style-class="'!border-gray-300 !bg-white !text-gray-900'"
                :checkbox-icon="'pi pi-check'"
                :filter="true"
                :filter-placeholder="t('organisation.selectCommune')"
                :filter-by="filterLabelKey"
                :show-select-all="false"
                :options="communalGroups"
                option-label="label"
                option-value="value"
                :placeholder="t('organisation.selectCommune')"
                show-clear
                class="min-w-[100px] flex-1 text-xs"
                :pt="{
                    overlay: { 'data-cy': 'multiselect-filter-list' },
                }"
                :selected-items-label="
                    t('organisation.category.commune') +
                    ': ' +
                    multiSelectLabel(selectedCommunal, communalGroups)
                "
                @focus="emit('focus')"
                @blur="emit('blur')"
            >
            </MultiSelect>
        </div>
        <div
            v-if="
                isShowTags &&
                (selectedFederal.length || selectedCantonal.length || selectedCommunal.length)
            "
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
    </div>
</template>
