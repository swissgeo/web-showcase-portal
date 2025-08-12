<script lang="ts" setup>
import Tag from 'primevue/tag'

import LucideIcon from '@/components/general/LucideIcon.vue'

const emit = defineEmits(['remove'])
</script>

<template>
    <Tag
        v-bind="$attrs"
        class="cursor-pointer"
        @click="emit('remove')"
    >
        <template #icon>
            <LucideIcon
                name="X"
                class="order-2 w-4"
            />
        </template>
    </Tag>
</template>
