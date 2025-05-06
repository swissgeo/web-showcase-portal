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
        <!-- Badge for layer count (not possible to use PrimeVue Badge with custon icon)-->
        <span
            v-if="layerCount > -1"
            class="absolute top-0 right-0 bg-slate-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2"
            >
            {{ layerCount }}
        </span>
    </div>
</template>

<style scoped>
/* Removed unnecessary custom styles as Tailwind classes are used */
</style>
