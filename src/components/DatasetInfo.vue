<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import { watch, onMounted, ref } from 'vue'

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
    <div class="fixed top-8 md:static md:top-0">
        <div
            class="flex flex-col border border-neutral-500 bg-white p-8 shadow-lg md:border-neutral-200 md:shadow-none"
        >
            <div class="self-end">
                <Button
                    icon="pi pi-times"
                    class="cursor-pointer"
                    @click="close"
                >
                </Button>
            </div>

            <!-- this will go away, it's only for POC -->
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="layerInfo"></div>
        </div>
    </div>
</template>
