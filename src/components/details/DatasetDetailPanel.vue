<script setup lang="ts">
import { storeToRefs } from 'pinia'
import ProgressSpinner from 'primevue/progressspinner'
import { watch, onMounted, computed } from 'vue'

import { fetchGeocatalogLayerDescription } from '@/api/topics.api'
import DatasetDetails from '@/components/details/DatasetDetails.vue'
import useGeocat from '@/search/geocat'
import { useMainStore } from '@/store/main'
import { parseGeocatalogHtml } from '@/utils/parseGeocatalogHtml'

const mainStore = useMainStore()
const { infoLayerId } = storeToRefs(mainStore)
const geocat = useGeocat()

const fetchInfo = async () => {
    const mainStore = useMainStore()
    const id = mainStore.infoLayerId
    if (!id) {
        return
    }

    try {
        // Try the geocat method first
        await geocat.getRecordDetails(id)

        // If that populated the record, we’re done
        if (mainStore.infoLayerRecord) {
            return
        }

        // Fallback: must be a Geocatalog layer, wait for it in the store

        const html = await fetchGeocatalogLayerDescription(id, mainStore.language)
        if (html) {
            const record = parseGeocatalogHtml(html)
            mainStore.setInfoLayerRecord(record)
        }
    } catch (err) {
        //eslint-disable-next-line no-console
        console.error('Couldnt fetch information for layer:', err)
    }
}

const info = computed(() => mainStore.infoLayerRecord)

onMounted(fetchInfo)
watch(infoLayerId, fetchInfo)
</script>

<template>
    <DatasetDetails
        v-if="info"
        class="scrollbar-none overflow-hidden"
        :info="info"
    />
    <div
        v-else
        class="flex h-full items-center justify-center"
    >
        <ProgressSpinner />
    </div>
</template>
