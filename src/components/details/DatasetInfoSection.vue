<script setup lang="ts">
import { computed } from 'vue'

import type { GeonetworkRecord } from '@/types/gnRecord'

import { useMainStore } from '@/store/main'
import { sanitize } from '@/utils/sanitizer'

const props = defineProps<{
    info: GeonetworkRecord
}>()

const mainStore = useMainStore()

const infoAbstract = computed(() => {
    return props.info?.abstract || mainStore.infoLayerRecord?.abstract || ''
})
</script>

<template>
    <div data-cy="div-dataset-info-abstract">
        <!-- eslint-disable-next-line vue/no-v-html  vue/no-v-text-v-html-on-component-->
        <div v-html="sanitize(infoAbstract)"></div>
    </div>
</template>
