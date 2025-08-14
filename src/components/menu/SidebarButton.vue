<script lang="ts" setup>
import { inject } from 'vue'

import IconButton from '@/components/general/IconButton.vue'
const emit = defineEmits(['click'])

const { title } = defineProps<{
    title: string
    isActive: boolean
    icon: string
}>()

const isDesktop = inject<boolean>('isDesktop', true)
</script>

<template>
    <IconButton
        :severity="isActive ? 'primary' : 'secondary'"
        :outlined="!isDesktop"
        class="h-10"
        :class="{ 'h-14 w-14 rounded-xl bg-white': !isDesktop }"
        :icon-class="{ 'text-white': isActive, 'w-5 text-cyan-900': true }"
        :text="!isActive"
        :title="title"
        :icon="icon"
        @click="emit('click')"
    ></IconButton>
</template>
