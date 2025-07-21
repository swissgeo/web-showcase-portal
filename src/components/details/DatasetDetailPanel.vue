<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { watch, onMounted, computed } from 'vue'

import { fetchGeocatalogLayerDescription } from '@/api/topics.api'
import DatasetDetails from '@/components/details/DatasetDetails.vue'
import useGeocat from '@/search/geocat'
import { useMainStore } from '@/store/main'
import { LayerType } from '@/types/layer'
import { parseGeocatalogHtml } from '@/utils/parseGeocatalogHtml'

const mainStore = useMainStore()
const { infoLayerId } = storeToRefs(mainStore)
const geocat = useGeocat()

const fetchInfo = async () => {
    if (mainStore.infoLayerId) {
        const layer = mainStore.getLayerById(mainStore.infoLayerId)
        if (layer?.type === LayerType.Geocatalog) {
            fetchGeocatalogLayerDescription(mainStore.infoLayerId, mainStore.language)
                .then((html) => {
                    if (html) {
                        const record = parseGeocatalogHtml(html)
                        mainStore.setInfoLayerRecord(record)
                    }
                })
                .catch((error) => {
                    //eslint-disable-next-line no-console
                    console.error('Error fetching layer info HTML:', error)
                })
        } else {
            geocat.getRecordDetails(mainStore.infoLayerId)
        }
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
</template>
