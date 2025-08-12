<script setup lang="ts">
import { GripVertical } from 'lucide-vue-next'
import Divider from 'primevue/divider'
import InputNumber from 'primevue/inputnumber'
import Menu from 'primevue/menu'
import Slider from 'primevue/slider'
import { computed, nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import type { Layer } from '@/types/layer'

import IconButton from '@/components/general/IconButton.vue'
import LucideIcon from '@/components/general/LucideIcon.vue'
import { useMapPreview } from '@/composables/useMapPreview'
import { TRANSPARENCY_DEBOUNCE_DELAY, zoomToExtent } from '@/search/mapUrlUtils'
import { useMainStore } from '@/store/main' // maybe not the best place to import this from
import { useMapStore } from '@/store/map'
import { useUiStore } from '@/store/ui'
import { debounce } from '@/utils/debounce'
import { getServiceResource } from '@/utils/layerUtils'
const { t } = useI18n()

interface Props {
    layer: Layer
    isBgLayer?: boolean
}

// Define props for the LayerItem component
const layerProps = withDefaults(defineProps<Props>(), {
    isBgLayer: false,
})

// Define emits for the LayerItem component
const emit = defineEmits(['delete-layer'])
const mainStore = useMainStore()
const mapStore = useMapStore()
const uiStore = useUiStore()
const { extractLayerExtent, getExtentCoordinates } = useMapPreview()

// State to toggle the visibility of the opacity slider
const showOpacitySlider = ref(false)

const menu = ref()
const menuShown = ref(false)

const isLayerDetailsDisplayed = computed(() => {
    return mainStore.infoLayerId === layerProps.layer.id
})

// Method to toggle layer visibility
const toggleVisibility = () => {
    if (layerProps.isBgLayer) {
        mainStore.setBgLayerVisibility(layerProps.layer.id, !layerProps.layer.visible)
    } else {
        mainStore.setLayerVisibility(layerProps.layer.id, !layerProps.layer.visible)
    }
}

// Computed property for opacity value with getter and setter
const opacityValue = computed({
    get() {
        return Math.abs(100 - (layerProps.layer.opacity ?? 1) * 100)
    },
    set(val: number | number[]) {
        let value = Array.isArray(val) ? val[0] : val
        value = Number(value)
        if (isNaN(value)) {
            value = 0
        }
        value = Math.max(0, Math.min(100, value))
        debouncedChangeOpacity(layerProps.layer.id, value)
    },
})

const debouncedChangeOpacity = debounce((layerId: string, value: number) => {
    const opacity = 1 - value / 100 //such that we have 0% opacity at 100 and 100% opacity at 0
    mainStore.setLayerOpacity(layerId, opacity)
}, TRANSPARENCY_DEBOUNCE_DELAY)

const metadataMenuClicked = () => {
    menuShown.value = false
    mainStore.setInfoLayerId(layerProps.layer.id)
    uiStore.setOpenLayerWindowFromDetailButton(false)
    nextTick(() => {
        uiStore.setOpenLayerWindowFromDetailButton(true)
    })

    uiStore.setLayerWindowVisible(true)
}

const opacityMenuClicked = () => {
    showOpacitySlider.value = true
    menuShown.value = false
}
const deleteMenuClicked = () => {
    emit('delete-layer', layerProps.layer)
    menuShown.value = false
}

const zoomToExtentMenuClicked = async () => {
    // eslint-disable-next-line no-console
    console.log('Zoom to extent clicked for layer:', layerProps.layer.id)

    // Get the layer extent using useMapPreview composable
    try {
        if (!layerProps.layer.geonetworkRecord) {
            // eslint-disable-next-line no-console
            console.error('No geonetwork record found for layer:', layerProps.layer.id)
            return
        }

        const wmsResource = getServiceResource('wms', layerProps.layer.geonetworkRecord)
        if (!wmsResource || !wmsResource.url || !wmsResource.name) {
            // eslint-disable-next-line no-console
            console.error('No WMS resource found for layer:', layerProps.layer.id)
            return
        }

        const wmsBaseUrl = wmsResource.url.href
        const layerName = wmsResource.name

        // eslint-disable-next-line no-console
        console.log('Extracting extent for layer:', layerName, 'from URL:', wmsBaseUrl)
        const rawExtent = await extractLayerExtent(wmsBaseUrl, layerName)

        if (!rawExtent) {
            // eslint-disable-next-line no-console
            console.error('No extent found for layer:', layerName)
            return
        }

        // Use getExtentCoordinates to get cleaned extent coordinates
        const cleanedCoordinates = getExtentCoordinates(rawExtent)

        // Extract cleaned extent from the polygon coordinates
        // cleanedCoordinates format: [[minX, minY], [minX, maxY], [maxX, maxY], [maxX, minY], [minX, minY]]
        const minX = cleanedCoordinates[0][0]
        const minY = cleanedCoordinates[0][1]
        const maxX = cleanedCoordinates[2][0]
        const maxY = cleanedCoordinates[2][1]
        const cleanedExtent: [number, number, number, number] = [minX, minY, maxX, maxY]

        // Use zoomToExtent to set zoom and center
        zoomToExtent(cleanedExtent, mapStore)
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error getting layer extent:', error)
    } finally {
        menuShown.value = false
    }
}

// Menu items for context menu
const menuItems = [
    {
        label: t('layerCart.showInfo'),
        icon: 'Info',
        command: () => metadataMenuClicked(),
    },
    {
        label: t('layerCart.transparency'),
        icon: 'SquaresSubtract',
        command: () => opacityMenuClicked(),
    },
    {
        label: t('layerCart.zoomToExtent'),
        icon: 'ZoomIn',
        command: () => zoomToExtentMenuClicked(),
    },
]

// Menu items for context menu for background layers
const menuItemsBgLayer = [
    {
        label: t('layerCart.showInfo'),
        icon: 'Info',
        disabled: true,
        command: () => metadataMenuClicked(),
    },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toggleLayerMenu = (event: any) => {
    menu.value.toggle(event)
    menuShown.value = !menuShown.value
}

const bgLayerThumbnail = computed(() => {
    if (layerProps.isBgLayer && layerProps.layer.id) {
        try {
            return new URL(`../assets/images/${layerProps.layer.id}.png`, import.meta.url).href
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(`Image not found for layer ID: ${layerProps.layer.id}: ${e}`)
            return ''
        }
    }
    return ''
})

const tooltipContent = computed(() => {
    if (layerProps.isBgLayer) {
        return t(layerProps.layer.name)
    }
    const fullTitle = layerProps.layer.geonetworkRecord?.title || layerProps.layer.name || ''
    const owner =
        layerProps.layer.geonetworkRecord?.ownerOrganization?.name ||
        layerProps.layer.attribution ||
        ''
    return owner ? `${fullTitle}\n\n${owner}` : fullTitle
})
</script>

<template>
    <li
        class="group relative flex flex-col rounded-md p-2 shadow"
        :class="{ 'bg-slate-200': isLayerDetailsDisplayed, 'bg-white': !isLayerDetailsDisplayed }"
    >
        <div
            v-if="!layerProps.isBgLayer"
            class="layer-item-drag-handle absolute top-3 -left-4 hidden h-auto w-auto cursor-grab rounded-md border border-[#DFE4E9] shadow group-hover:flex"
        >
            <GripVertical />
        </div>
        <div
            class="flex items-center space-x-2"
            :title="tooltipContent"
        >
            <IconButton
                variant="outlined"
                rounded
                :title="layer.visible ? t('layerCart.hideLayer') : t('layerCart.showLayer')"
                size="small"
                class="flex items-center justify-center border border-transparent"
                :icon="layer.visible ? 'Eye' : 'EyeOff'"
                @click="toggleVisibility"
            >
            </IconButton>

            <span
                :class="{ 'text-gray-400 line-through': !layer.visible }"
                class="layer-item-drag-handle flex-1 cursor-grab truncate text-sm font-medium"
                >{{ t(layer.name) }}</span
            >
            <img
                v-if="isBgLayer"
                :src="bgLayerThumbnail"
                alt="Background Layer Thumbnail"
                class="h-10 w-10 rounded-full object-cover"
            />
            <IconButton
                v-if="!layerProps.isBgLayer"
                variant="outlined"
                rounded
                size="small"
                class="flex items-center justify-center border border-transparent"
                icon="Trash2"
                icon-class="w-5 h-5"
                @click="deleteMenuClicked"
            >
            </IconButton>

            <IconButton
                type="button"
                icon="EllipsisVertical"
                icon-class="h-4"
                aria-haspopup="true"
                aria-controls="overlay_menu"
                size="small"
                :class="{ 'ml-2': isBgLayer }"
                :severity="menuShown ? 'primary' : 'secondary'"
                :data-cy="`button-layer-item-${layer.id}`"
                @click="toggleLayerMenu"
            />
            <Menu
                id="overlay_menu"
                ref="menu"
                :model="isBgLayer ? menuItemsBgLayer : menuItems"
                :popup="true"
            >
                <template #item="{ item, props }">
                    <a
                        class="flex items-center"
                        v-bind="props.action"
                    >
                        <LucideIcon :name="item.icon ?? ''" />
                        <span>{{ item.label }}</span>
                        <span
                            v-if="item.shortcut"
                            class="border-surface bg-emphasis text-muted-color ml-auto rounded border p-1 text-xs"
                            >{{ item.shortcut }}</span
                        >
                    </a>
                </template>
            </Menu>
        </div>
        <Divider v-if="showOpacitySlider && !isBgLayer" />
        <div
            v-if="showOpacitySlider && !isBgLayer"
            class="flex items-center space-x-4"
        >
            <Slider
                v-model="opacityValue"
                :min="0"
                :max="100"
                class="w-full"
                :class="{
                    'bg-white': isLayerDetailsDisplayed,
                }"
            />
            <InputNumber
                v-model="opacityValue"
                :min="0"
                :max="100"
                fluid
                suffix="%"
                style="width: 8rem"
            />
            <IconButton
                type="button"
                size="small"
                severity="secondary"
                icon="X"
                @click="showOpacitySlider = false"
            />
        </div>
    </li>
</template>
