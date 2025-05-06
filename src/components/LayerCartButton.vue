<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMainStore } from '@/store/main';
import { useUiStore } from '@/store/ui';
import Button from 'primevue/button';

import LayerIcon from '@/assets/icons/layers.svg?use';

// Access the store
const mainStore = useMainStore();
const uiStore = useUiStore();

// Compute the number of layers on the map
const layerCount = computed(() => mainStore.layersOnMap.length);

// Toggle visibility of the layer cart
const toggleLayerCart = () => {
    uiStore.toggleLayerCart();
};

</script>

<template>
    <div class="relative inline-block">
        <Button
            :severity="uiStore.layerCartVisible ? 'primary' : 'secondary'"
            size="small"
            class="h-10 cursor-pointer"
            @click="toggleLayerCart"
        >
            <LayerIcon class="h-6 w-6 stroke-current"></LayerIcon>
        </Button>
        <!-- Badge for layer count -->
        <span
            v-if="layerCount > -1"
            class="absolute top-0 right-0 bg-slate-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2"
            >
            {{ layerCount }}
        </span>

        <!-- Floating layer cart next to the button -->
        <div v-if="uiStore.layerCartVisible" class="absolute top-12 left-0 w-80 bg-white shadow-lg rounded-lg border border-gray-300 p-4 z-50">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold">Selected Layers</h3>
                <button @click="toggleLayerCart" class="text-gray-500 hover:text-gray-700 text-xl cursor-pointer">&times;</button>
            </div>
            <ul v-if="mainStore.layersOnMap.length > 0" class="space-y-2">
                <li v-for="layer in mainStore.layersOnMap" :key="layer.id" class="flex justify-between items-center p-2 bg-gray-100 shadow rounded-md">
                    <div class="flex items-center space-x-2">
                        <input type="checkbox" v-model="layer.visible" class="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" />
                        <span class="text-sm font-medium">{{ layer.name }}</span>
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
