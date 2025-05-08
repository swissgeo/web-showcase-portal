<script setup lang="ts">
import { ref } from 'vue';
import { defineProps } from 'vue';
import { defineEmits } from 'vue';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import { useMainStore } from '@/store/main';  // maybe not the best place to import this from
import { GripVertical } from 'lucide-vue-next';

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
});

// Define emits for the LayerItem component
const emit = defineEmits(['delete-layer']);
const mainStore = useMainStore();

// State to toggle the visibility of the opacity slider
const showOpacitySlider = ref(false);

const menu = ref();
const menuShown = ref(false);

// Method to toggle layer visibility
const toggleVisibility = () => {
    if(props.isBgLayer) {
        mainStore.setBgLayerVisibility(props.layer.id, !props.layer.visible);
    } else {
        props.layer.visible = !props.layer.visible;
    }
}
// Method to update opacity
const updateOpacity = (event: Event) => {
    const target = event.target as HTMLInputElement;
    props.layer.opacity = parseFloat(target.value) / 100;
};

const metadataMenuClicked = () => {
    console.log('Metadata clicked');
    menuShown.value = false;
};
const deleteMenuClicked = () => {
    emit('delete-layer', props.layer);
    menuShown.value = false
};

// Menu items for context menu
const menuItems = [
    { label: 'Metadata', icon: 'pi pi-info-circle', command: () => metadataMenuClicked() },
    { label: 'Delete', icon: 'pi pi-trash', command: () => deleteMenuClicked() },
];

// Menu items for context menu for background layers
const menuItemsBgLayer = [
    { label: 'Metadata', icon: 'pi pi-info-circle', command: () => metadataMenuClicked() },
];

const toggleLayerMenu = (event: any) => {
    menu.value.toggle(event);
    menuShown.value = !menuShown.value;
};
</script>

<template>
    <li class="flex flex-col p-2 bg-white shadow rounded-md layer-item relative group">
        <div v-if="!props.isBgLayer" class="absolute -left-4 top-3 h-auto w-auto hidden cursor-grab group-hover:flex shadow rounded-md  border border-[#DFE4E9]" >
            <GripVertical  />
        </div>
        <!-- <GripVertical class="absolute left-0 top-0 h-full hidden cursor-grab group-hover:flex" /> -->
        <div class="flex items-center justify-between space-x-4">
            <button @click="toggleVisibility" class="p-button-rounded p-button-outlined p-button-sm cursor-pointer">
                <span v-if="layer.visible" class="pi pi-eye"></span>
                <span v-else class="pi pi-eye-slash"></span>
            </button>
            <span :class="{'line-through text-gray-400': !layer.visible}" class="text-sm font-medium truncate flex-1 cursor-grab" style="max-width: 200px;">{{ layer.name }}</span>
            <button v-if="layer.visible && !isBgLayer" @click="showOpacitySlider = !showOpacitySlider" class="p-button-text p-button-sm cursor-pointer">
                <span :class="{'bg-black text-white': showOpacitySlider, 'bg-gray-100 text-black': !showOpacitySlider}" class="text-sm font-medium px-2 py-1 rounded">
                    {{ Math.round((layer.opacity ?? 1) * 100) }}%
                </span>
            </button>
            <Button type="button" icon="pi pi-ellipsis-v" @click="toggleLayerMenu" aria-haspopup="true" aria-controls="overlay_menu" size="small" :severity="menuShown ? 'primary' : 'secondary'" />
            <Menu ref="menu" id="overlay_menu" :model="isBgLayer ? menuItemsBgLayer : menuItems" :popup="true" />
        </div>
        <div v-if="showOpacitySlider && !isBgLayer" class="mt-2">
            <hr class="border-t border-gray-300 mb-2" />
            <input type="range" min="0" max="100" :value="Math.round((layer.opacity ?? 1) * 100)" @input="updateOpacity" class="w-full" />
        </div>
    </li>
</template>

<style scoped>
</style>
