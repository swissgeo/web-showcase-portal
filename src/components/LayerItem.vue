<script setup lang="ts">
import { GripVertical } from 'lucide-vue-next'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import InputNumber from 'primevue/inputnumber'
import Menu from 'primevue/menu'
import Slider from 'primevue/slider'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import type { Layer } from '@/types/Layer'

import { TRANSPARENCY_DEBOUNCE_DELAY } from '@/search/mapUrlUtils'
import { useMainStore } from '@/store/main' // maybe not the best place to import this from
import { debounce } from '@/utils/debounce'
const { t } = useI18n()

interface Props {
    layer: Layer
    isBgLayer?: boolean
}

// Define props for the LayerItem component
const props = withDefaults(defineProps<Props>(), {
    isBgLayer: false,
})

// Define emits for the LayerItem component
const emit = defineEmits(['delete-layer'])
const mainStore = useMainStore()

// State to toggle the visibility of the opacity slider
const showOpacitySlider = ref(false)

const menu = ref()
const menuShown = ref(false)

const isLayerDetailsDisplayed = computed(() => {
    return mainStore.infoLayerId === props.layer.id
})

// Method to toggle layer visibility
const toggleVisibility = () => {
    if (props.isBgLayer) {
        mainStore.setBgLayerVisibility(props.layer.id, !props.layer.visible)
    } else {
        mainStore.setLayerVisibility(props.layer.id, !props.layer.visible)
    }
}

// Computed property for opacity value with getter and setter
const opacityValue = computed({
    get() {
        return Math.abs(100 - (props.layer.opacity ?? 1) * 100)
    },
    set(val: number | number[]) {
        let value = Array.isArray(val) ? val[0] : val
        value = Number(value)
        if (isNaN(value)) {
            value = 0
        }
        value = Math.max(0, Math.min(100, value))
        debouncedChangeOpacity(props.layer.id, value)
    },
})

const debouncedChangeOpacity = debounce((layerId: string, value: number) => {
    const opacity = 1 - value / 100 //such that we have 0% opacity at 100 and 100% opacity at 0
    mainStore.setLayerOpacity(layerId, opacity)
}, TRANSPARENCY_DEBOUNCE_DELAY)

const metadataMenuClicked = () => {
    menuShown.value = false
    mainStore.setInfoLayerId(props.layer.id)
}

const opacityMenuClicked = () => {
    showOpacitySlider.value = true
    menuShown.value = false
}
const deleteMenuClicked = () => {
    emit('delete-layer', props.layer)
    menuShown.value = false
}

// Menu items for context menu
const menuItems = [
    {
        label: t('layerCart.showInfo'),
        icon: 'pi pi-info-circle',
        command: () => metadataMenuClicked(),
    },
    {
        label: t('layerCart.transparency'),
        icon: 'pi pi-clone',
        command: () => opacityMenuClicked(),
    },
    { label: t('layerCart.delete'), icon: 'pi pi-trash', command: () => deleteMenuClicked() },
]

// Menu items for context menu for background layers
const menuItemsBgLayer = [
    {
        label: t('layerCart.showInfo'),
        icon: 'pi pi-info-circle',
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
    if (props.isBgLayer && props.layer.id) {
        try {
            return new URL(`../assets/images/${props.layer.id}.png`, import.meta.url).href
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(`Image not found for layer ID: ${props.layer.id}: ${e}`)
            return ''
        }
    }
    return ''
})
</script>

<template>
    <li
        class="group relative flex flex-col rounded-md p-2 shadow"
        :class="{ 'bg-slate-200': isLayerDetailsDisplayed, 'bg-white': !isLayerDetailsDisplayed }"
    >
        <div
            v-if="!props.isBgLayer"
            class="layer-item-drag-handle absolute top-3 -left-4 hidden h-auto w-auto cursor-grab rounded-md border border-[#DFE4E9] shadow group-hover:flex"
        >
            <GripVertical />
        </div>
        <!-- <GripVertical class="absolute left-0 top-0 h-full hidden cursor-grab group-hover:flex" /> -->
        <div class="flex items-center justify-between space-x-4">
            <button
                class="p-button-rounded p-button-outlined p-button-sm cursor-pointer"
                @click="toggleVisibility"
            >
                <span
                    v-if="layer.visible"
                    class="pi pi-eye"
                ></span>
                <span
                    v-else
                    class="pi pi-eye-slash"
                ></span>
            </button>
            <span
                :class="{ 'text-gray-400 line-through': !layer.visible }"
                class="layer-item-drag-handle flex-1 cursor-grab truncate text-sm font-medium"
                style="max-width: 200px"
                >{{ t(layer.name) }}</span
            >
            <img
                v-if="isBgLayer"
                :src="bgLayerThumbnail"
                alt="Background Layer Thumbnail"
                class="h-10 w-10 rounded-full object-cover"
            />
            <Button
                type="button"
                icon="pi pi-ellipsis-v"
                aria-haspopup="true"
                aria-controls="overlay_menu"
                size="small"
                :severity="menuShown ? 'primary' : 'secondary'"
                :data-cy="`button-layer-item-${layer.id}`"
                @click="toggleLayerMenu"
            />
            <Menu
                id="overlay_menu"
                ref="menu"
                :model="isBgLayer ? menuItemsBgLayer : menuItems"
                :popup="true"
            />
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
            />
            <InputNumber
                v-model="opacityValue"
                :min="0"
                :max="100"
                fluid
                suffix="%"
                style="width: 8rem"
            />
            <Button
                type="button"
                size="small"
                severity="secondary"
                icon="pi pi-times"
                @click="showOpacitySlider = false"
            />
        </div>
    </li>
</template>
