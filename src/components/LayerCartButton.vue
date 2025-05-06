<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMainStore } from '@/store/main';
import Button from 'primevue/button';

import LayerIcon from '@/assets/icons/layers.svg?use';

// Access the store
const store = useMainStore();

// Compute the number of layers on the map
const layerCount = computed(() => store.layersOnMap.length);

// Toggle visibility of the layer cart
const isLayerCartVisible = ref(false);
const toggleLayerCart = () => {
    isLayerCartVisible.value = !isLayerCartVisible.value;
    console.log('Layer cart toggled', isLayerCartVisible.value);
};

const toggleVisibility = (layerId: string) => {
    const layer = store.layersOnMap.find(layer => layer.id === layerId);
    if (layer) {
        layer.visible = !layer.visible;
    }
};

const updateTransparency = (layerId: string, transparency: number) => {
    const layer = store.layersOnMap.find(layer => layer.id === layerId);
    if (layer) {
        layer.transparency = transparency;
    }
};
</script>

<template>
    <div class="relative inline-block">
        <Button
            severity="secondary"
            size="small"
            class="h-10"
            @click="toggleLayerCart"
        >
            <LayerIcon class="h-6 w-6 stroke-current"></LayerIcon>
        </Button>
        <!-- Badge for layer count -->
        <span
            v-if="layerCount > -1"
            class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
        >
            {{ layerCount }}
        </span>

        <!-- Floating layer cart next to the button -->
        <div v-if="isLayerCartVisible" class="absolute top-12 left-0 w-80 bg-white shadow-lg rounded-lg border border-gray-300 p-4 z-50">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold">Selected Layers</h3>
                <button @click="toggleLayerCart" class="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
            </div>
            <ul v-if="store.layersOnMap.length > 0" class="space-y-2">
                <li v-for="layer in store.layersOnMap" :key="layer.id" class="flex justify-between items-center p-2 bg-gray-100 shadow rounded-md">
                    <div class="flex items-center space-x-4">
                        <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span class="text-xs font-bold text-gray-600">{{ layer.id }}</span>
                        </div>
                        <span class="text-sm font-medium">{{ layer.name }}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button @click="toggleVisibility(layer.id)" class="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">Toggle</button>
                        <input type="range" min="0" max="100" v-model="layer.transparency" @input="updateTransparency(layer.id, layer.transparency)" class="w-24" />
                    </div>
                </li>
            </ul>
            <p v-else class="text-sm text-gray-500">No layers are currently selected.</p>
        </div>
    </div>
</template>

<style scoped>
/* Removed unnecessary custom styles as Tailwind classes are used */
</style>
