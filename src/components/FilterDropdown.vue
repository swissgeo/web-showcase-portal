<script setup lang="ts">
import { ref } from 'vue'

import MultiSelect from '@/components/general/MultiSelect.vue'

const { label, options } = defineProps<{ label: string; options: [] }>()

const selected = ref(null)
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
        >
        </MultiSelect>
        <!-- @focus="emit('focus')" @blur="emit('blur')" -->
        <!-- :selected-items-label="
            t('organisation.category.federal_office') +
            ': ' +
            multiSelectLabel(selectedFederal, federalGroups)
        " -->
    </div>
</template>
