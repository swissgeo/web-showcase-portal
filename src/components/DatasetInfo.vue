<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { watch, onMounted, ref } from 'vue'

import TimesIcon from '@/assets/icons/times.svg?use'
import { useMainStore } from '@/store/main'

const mainStore = useMainStore()
const { infoLayerId } = storeToRefs(mainStore)

const layerInfo = ref('')

const fetchInfo = async () => {
    const url = `https://api3.geo.admin.ch/rest/services/all/MapServer/${infoLayerId.value}/legend?lang=de`

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json, text/plain, */*',
        },
    })
    layerInfo.value = await response.text()
}

onMounted(async () => {
    fetchInfo()
})

const close = () => {
    mainStore.resetInfoLayerId()
}

watch(infoLayerId, fetchInfo)
</script>

<template>
    <div class="fixed md:static top-8 md:top-0">
        <div
            class="flex flex-col p-8 bg-white border shadow-lg border-neutral-500 md:border-neutral-200 md:shadow-none"
        >
            <div class="self-end">
                <button
                    class="cursor-pointer"
                    @click="close"
                >
                    <TimesIcon class="w-[32px] h-[32px]" />
                </button>
            </div>

            <!-- this will go away, it's only for POC -->
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="layerInfo"></div>
        </div>
    </div>
</template>
