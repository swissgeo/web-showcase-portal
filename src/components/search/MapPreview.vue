<script lang="ts" setup>
import 'ol/ol.css'
import ProgressSpinner from 'primevue/progressspinner'
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

import type { LayerInformation } from '@/types/mapPreview'

import { useMapPreview } from '@/composables/useMapPreview'
import { sanitize } from '@/utils/sanitizer'

const emit = defineEmits(['alignOverlay'])

interface Props {
    bgLayerName: string // Name of the background layer
    wmsBaseUrl: string
    selectedLayerName: string // Name of the selected layer to overlay
    extent?: [number, number, number, number] // Extent coordinates [minX, minY, maxX, maxY]
}

const { t } = useI18n()
const props = defineProps<Props>()
const {
    isPreviewLoading,
    hasPreviewError,
    previewMap,
    resetErrorState,
    addLayerExtentToMap,
    extractLayerInformation,
    addBackgroundLayer,
    createWMSLayer,
    addLayer,
} = useMapPreview()
// Reference for the map container
const mapContainer = ref<HTMLDivElement | null>(null)

const layerInformation = ref<LayerInformation>({
    abstract: null,
    title: null,
    extent: null,
})

// For async cancellation
const currentRequestId = Math.floor(Math.random() * 100000)
let destroyed = false

onBeforeUnmount(() => {
    destroyed = true
})

async function initializePreview(): Promise<void> {
    resetErrorState()
    addBackgroundLayer(props.bgLayerName)

    const info = await extractLayerInformation(
        props.wmsBaseUrl,
        props.selectedLayerName,
        currentRequestId
    )
    // Ignore if component was destroyed or not latest request
    if (destroyed) {
        return
    }

    layerInformation.value = info

    await nextTick()
    if (destroyed) {
        return
    }

    previewMap.value!.setTarget(mapContainer.value!)
    addLayer(createWMSLayer(props.wmsBaseUrl, props.selectedLayerName))
    if (layerInformation.value.extent) {
        addLayerExtentToMap(layerInformation.value.extent)
    }
    emit('alignOverlay') // Emit the 'alignOverlay' to realign the overlay after the size change
}

onMounted(() => {
    initializePreview()
})
</script>

<template>
    <div class="flex max-h-[390px] max-w-[270px] flex-col overflow-hidden text-ellipsis">
        <template v-if="!isPreviewLoading && !hasPreviewError">
            <div
                ref="mapContainer"
                class="h-[175px] w-[269px]"
            ></div>
            <div class="m-3 flex flex-col gap-2">
                <span class="font-bold"> {{ layerInformation.title }}</span>
                <div
                    class="line-clamp max-h-[100px]"
                    :innerHTML="sanitize(layerInformation.abstract!)"
                ></div>
            </div>
        </template>
        <template v-if="!isPreviewLoading && hasPreviewError">
            <div class="m-3">
                <p>{{ t('searchResult.noPreviewAvailable') }}</p>
            </div>
        </template>
        <template v-if="isPreviewLoading">
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
