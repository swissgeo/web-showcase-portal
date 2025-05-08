<script setup lang="ts">
import { GripVertical } from 'lucide-vue-next'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import { ref } from 'vue'
import { defineProps } from 'vue'
import { defineEmits } from 'vue'

import { useMainStore } from '@/store/main' // maybe not the best place to import this from

// Define props for the LayerItem component
const props = defineProps({
    layer: {
        type: Object,
        required: true,
    },
    isBgLayer: {
        type: Boolean,
        default: false,
    },
})

// Define emits for the LayerItem component
const emit = defineEmits(['delete-layer'])
const mainStore = useMainStore()

// State to toggle the visibility of the opacity slider
const showOpacitySlider = ref(false)

const menu = ref()
const menuShown = ref(false)

// Method to toggle layer visibility
const toggleVisibility = () => {
    if (props.isBgLayer) {
        mainStore.setBgLayerVisibility(props.layer.id, !props.layer.visible)
    } else {
        mainStore.setLayerVisibility(props.layer.id, !props.layer.visible)
    }
}
// Method to update opacity
const updateOpacity = (event: Event) => {
    const target = event.target as HTMLInputElement
    mainStore.setLayerOpacity(props.layer.id, parseFloat(target.value) / 100)
}

const metadataMenuClicked = () => {
    // eslint-disable-next-line no-console
    console.log('Metadata clicked')
    menuShown.value = false
}
const deleteMenuClicked = () => {
    emit('delete-layer', props.layer)
    menuShown.value = false
}

// Menu items for context menu
const menuItems = [
    { label: 'Metadata', icon: 'pi pi-info-circle', command: () => metadataMenuClicked() },
    { label: 'Delete', icon: 'pi pi-trash', command: () => deleteMenuClicked() },
]

// Menu items for context menu for background layers
const menuItemsBgLayer = [
    { label: 'Metadata', icon: 'pi pi-info-circle', command: () => metadataMenuClicked() },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toggleLayerMenu = (event: any) => {
    menu.value.toggle(event)
    menuShown.value = !menuShown.value
}
</script>

<template>
    <li class="layer-item group relative flex flex-col rounded-md bg-white p-2 shadow">
        <div
            v-if="!props.isBgLayer"
            class="absolute top-3 -left-4 hidden h-auto w-auto cursor-grab rounded-md border border-[#DFE4E9] shadow group-hover:flex"
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
                class="flex-1 cursor-grab truncate text-sm font-medium"
                style="max-width: 200px"
                >{{ layer.name }}</span
            >
            <button
                v-if="layer.visible && !isBgLayer"
                class="p-button-text p-button-sm cursor-pointer"
                @click="showOpacitySlider = !showOpacitySlider"
            >
                <span
                    :class="{
                        'bg-black text-white': showOpacitySlider,
                        'bg-gray-100 text-black': !showOpacitySlider,
                    }"
                    class="rounded px-2 py-1 text-sm font-medium"
                >
                    {{ Math.round((layer.opacity ?? 1) * 100) }}%
                </span>
            </button>
            <Button
                type="button"
                icon="pi pi-ellipsis-v"
                aria-haspopup="true"
                aria-controls="overlay_menu"
                size="small"
                :severity="menuShown ? 'primary' : 'secondary'"
                @click="toggleLayerMenu"
            />
            <Menu
                id="overlay_menu"
                ref="menu"
                :model="isBgLayer ? menuItemsBgLayer : menuItems"
                :popup="true"
            />
        </div>
        <div
            v-if="showOpacitySlider && !isBgLayer"
            class="mt-2"
        >
            <hr class="mb-2 border-t border-gray-300" />
            <input
                type="range"
                min="0"
                max="100"
                :value="Math.round((layer.opacity ?? 1) * 100)"
                class="w-full"
                @input="updateOpacity"
            />
        </div>
    </li>
</template>

<style scoped></style>
