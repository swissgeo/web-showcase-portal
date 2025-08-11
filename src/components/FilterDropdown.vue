<script setup lang="ts">
import { computed } from 'vue'

import type { FilterGroup } from '@/types/search'

import MultiSelect from '@/components/general/MultiSelect.vue'

const { modelValue, label, options, itemLabel } = defineProps<{
    label: string
    modelValue: number[] | null
    options: FilterGroup[]
    itemLabel: string
}>()

const emit = defineEmits(['update:modelValue'])

const selected = computed({
    get() {
        return modelValue
    },
    set(value: number[]) {
        emit('update:modelValue', value)
    },
})

const selectedItemLabel = computed(() => {
    if (!modelValue) {
        return
    }

    const label = multiSelectLabel(modelValue, options)
    return `${itemLabel}: ${label}`
})

function multiSelectLabel(selectedValues: number[], groups: FilterGroup[]): string {
    if (selectedValues) {
        return selectedValues
            .map((id) => groups.find((g) => g.value === id)?.label)
            .filter(Boolean)
            .join(', ')
    }
    return ''
}
</script>

<template>
    <div class="flex flex-col gap-2">
        <label>{{ label }}</label>
        <MultiSelect
            v-model="selected"
            :max-selected-labels="0"
            :checkbox-style-class="'!border-gray-300 !bg-white !text-gray-900'"
            :filter="true"
            :virtual-scroller-options="{ itemSize: 40 }"
            :options="options"
            option-label="label"
            option-value="value"
            show-clear
            class="mr-2 min-w-96 flex-1"
            :pt="{
                overlay: { 'data-cy': 'multiselect-filter-list' },
                label: {
                    class: 'block truncate max-w-[21ch]',
                },
            }"
            :selected-items-label="selectedItemLabel"
        >
        </MultiSelect>
    </div>
</template>
