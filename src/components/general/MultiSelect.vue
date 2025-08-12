<script lang="ts" setup>
import Divider from 'primevue/divider'
import MultiSelect from 'primevue/multiselect'

import LucideIcon from '@/components/general/LucideIcon.vue'
</script>

<template>
    <MultiSelect v-bind="$attrs">
        <template #clearicon="{ clearCallback }">
            <LucideIcon
                name="X"
                class="h-6 self-center text-[#1C6B85]"
                @click.stop="clearCallback"
            />
            <Divider
                layout="vertical"
                class="mx-2 my-2"
            />
        </template>
        <template #dropdownicon>
            <LucideIcon
                name="ChevronDown"
                class="text-[#1C6B85]"
            />
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
