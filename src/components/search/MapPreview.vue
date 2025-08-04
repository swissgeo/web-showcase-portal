<script lang="ts" setup>
import 'ol/ol.css'
import ProgressSpinner from 'primevue/progressspinner'
import { ref, onMounted, nextTick, onBeforeUnmount, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import type { GeonetworkRecord } from '@/types/gnRecord'

import { useMapPreview } from '@/composables/useMapPreview'
import useGeocat from '@/search/geocat'
import { sanitize } from '@/utils/sanitizer'

const emit = defineEmits(['alignOverlay'])

interface Props {
    layerId: string
    bgLayerName: string
    wmsBaseUrl: string
    selectedLayerName: string
}

const { t } = useI18n()
const props = defineProps<Props>()
const {
    isPreviewLoading,
    hasPreviewError,
    previewMap,
    resetErrorState,
    addLayerExtentToMap,
    addBackgroundLayer,
    createWMSLayer,
    extractLayerExtent,
    addLayer,
} = useMapPreview()
const geocat = useGeocat()

// Reference for the map container
const mapContainer = ref<HTMLDivElement | null>(null)

const infoLayerRecord = ref<GeonetworkRecord | null>(null)
let destroyed = false

onBeforeUnmount(() => {
    destroyed = true
})

async function initializePreview(): Promise<void> {
    infoLayerRecord.value = await geocat.getRecordDetailsAsync(props.layerId)
    await nextTick()

    resetErrorState()
    addBackgroundLayer(props.bgLayerName)
    let extent: [number, number, number, number] | undefined

    try {
        extent = await extractLayerExtent(props.wmsBaseUrl, props.selectedLayerName)
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log('Error adding layer extent:', error)
    }

    if (destroyed) {
        return
    }

    addLayer(createWMSLayer(props.wmsBaseUrl, props.selectedLayerName, extent))
    addLayerExtentToMap(extent)

    if (destroyed || !mapContainer.value) {
        hasPreviewError.value = true
        emit('alignOverlay')
        return
    }
    previewMap.value!.setTarget(mapContainer.value)
    emit('alignOverlay') // Emit the 'alignOverlay' to realign the overlay
}

watch(hasPreviewError, async (newValue) => {
    if (newValue) {
        await nextTick()
        emit('alignOverlay') // Emit when there's an error to realign the overlay
    }
})

onMounted(() => {
    initializePreview()
})
</script>

<template>
    <div class="flex max-h-[390px] max-w-[260px] flex-col overflow-hidden text-ellipsis">
        <template v-if="!isPreviewLoading && !hasPreviewError && infoLayerRecord">
            <div
                ref="mapContainer"
                class="h-[175px] w-[267px]"
            ></div>
            <div class="m-3 flex flex-col gap-2">
                <span class="font-bold"> {{ infoLayerRecord?.title }}</span>
                <div
                    class="line-clamp max-h-[100px]"
                    :innerHTML="sanitize(infoLayerRecord?.abstract!)"
                ></div>
            </div>
        </template>
        <template v-if="!isPreviewLoading && hasPreviewError">
            <div class="m-3">
                <p>{{ t('searchResult.noPreviewAvailable') }}</p>
            </div>
        </template>
        <template v-if="isPreviewLoading || !infoLayerRecord">
            <div class="m-3">
                <ProgressSpinner class="size-16" />
            </div>
        </template>
    </div>
</template>

<style scoped>
.line-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
