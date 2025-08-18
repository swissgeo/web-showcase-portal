<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { computed } from 'vue'

import type { OnlineResource } from '@/types/gnRecord'

const { data } = defineProps<{
    data: OnlineResource
}>()

const url = computed(() => {
    return data.url
})

const title = computed(() => {
    return data.description || data.name || '-'
})
</script>

<template>
    <li class="border-b border-neutral-100 py-1 text-sm">
        <a
            :href="url.toString()"
            class="flex items-center justify-between"
            target="_blank"
        >
            <div>{{ title }}</div>
            <div
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-neutral-50 text-black"
            >
                <ArrowUpRight class="h-5 w-5" /></div
        ></a>
    </li>
</template>
