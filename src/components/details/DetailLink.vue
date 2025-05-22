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
    <li class="border-b border-neutral-100 text-sm">
        <a
            :href="url.toString()"
            class="flex h-14 items-center justify-between"
            target="_blank"
        >
            <div>{{ title }}</div>
            <div class="flex h-8 w-8 items-center justify-center rounded bg-neutral-100 text-black">
                <ArrowUpRight class="h-5 w-5" /></div
        ></a>
    </li>
</template>
