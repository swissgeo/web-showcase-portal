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
                class="text-primary h-6 self-center"
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
                class="text-primary"
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
