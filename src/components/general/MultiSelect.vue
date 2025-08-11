<script lang="ts" setup>
import MultiSelect from 'primevue/multiselect'

import LucideIcon from '@/components/general/LucideIcon.vue'
</script>

<template>
    <MultiSelect v-bind="$attrs">
        <template #clearicon="{ clearCallback }">
            <LucideIcon
                name="X"
                @click="clearCallback"
            />
        </template>
        <template #dropdownicon>
            <LucideIcon name="ChevronDown" />
        </template>
        <template #itemcheckboxicon="{ checked }">
            <LucideIcon
                v-if="checked"
                name="Check"
                class="text-white"
            />
        </template>
    </MultiSelect>
</template>
