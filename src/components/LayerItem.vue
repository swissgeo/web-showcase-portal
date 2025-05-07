<script setup lang="ts">
import { ref } from 'vue';
import { defineProps } from 'vue';
import Button from 'primevue/button';
import Menu from 'primevue/menu';

// Define props for the LayerItem component
const props = defineProps({
    layer: {
        type: Object,
        required: true,
    },
});

// State to toggle the visibility of the opacity slider
const showOpacitySlider = ref(false);
const menu = ref();
const menuShown = ref(false);

const toggleVisibility = () => {
    props.layer.visible = !props.layer.visible;
}
// Method to update opacity
const updateOpacity = (event: Event) => {
    const target = event.target as HTMLInputElement;
    props.layer.opacity = parseFloat(target.value) / 100;
};

// Menu items for context menu
const menuItems = [
    { label: 'Metadata', icon: 'pi pi-info-circle', command: () => console.log('Metadata clicked') },
    { label: 'Delete', icon: 'pi pi-trash', command: () => console.log('Delete clicked') },
];

const toggle = (event: any) => {
    menu.value.toggle(event);
    menuShown.value = !menuShown.value;
};
</script>

<template>
    <li class="flex flex-col p-2 bg-white shadow rounded-md">
        <div class="flex items-center justify-between space-x-4">
            <button @click="toggleVisibility" class="p-button-rounded p-button-outlined p-button-sm cursor-pointer">
                <span v-if="layer.visible" class="pi pi-eye"></span>
                <span v-else class="pi pi-eye-slash"></span>
            </button>
            <span :class="{'line-through text-gray-400': !layer.visible}" class="text-sm font-medium truncate flex-1" style="max-width: 200px;">{{ layer.name }}</span>
            <button v-if="layer.visible" @click="showOpacitySlider = !showOpacitySlider" class="p-button-text p-button-sm cursor-pointer">
                <span :class="{'bg-black text-white': showOpacitySlider, 'bg-gray-100 text-black': !showOpacitySlider}" class="text-sm font-medium px-2 py-1 rounded">
                    {{ Math.round((layer.opacity ?? 1) * 100) }}%
                </span>
            </button>
            <Button type="button" icon="pi pi-ellipsis-v" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" size="small" :severity="menuShown ? 'primary' : 'secondary'" />
            <Menu ref="menu" id="overlay_menu" :model="menuItems" :popup="true" />
        </div>
        <div v-if="showOpacitySlider" class="mt-2">
            <hr class="border-t border-gray-300 mb-2" />
            <input type="range" min="0" max="100" :value="Math.round((layer.opacity ?? 1) * 100)" @input="updateOpacity" class="w-full" />
        </div>
    </li>
</template>

<style scoped>
</style>
