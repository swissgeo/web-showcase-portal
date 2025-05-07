<script setup lang="ts">
import Panel from 'primevue/panel';
import { useUiStore } from '@/store/ui';
import { useMainStore } from '@/store/main';
import { computed } from 'vue';
import LayerItem from './LayerItem.vue';
import type { Layer } from '@/types/Layer';

const mainStore = useMainStore();
const uiStore = useUiStore();

const layers = computed(() => mainStore.layersOnMap || []);
const bgLayers = computed(() => mainStore.bgLayers || []);

const handleDeleteLayer = (layer: Layer) => {
    mainStore.deleteLayerById(layer.id);
};
</script>

<template>
    <Panel
        header="Maps displayed"
        :style="{ width: '350px' }">

        <template #icons>
            <button class="p-panel-header-icon p-link mr-1 cursor-pointer" @click="uiStore.setLayerCartVisible(false)">
                <span class="pi pi-chevron-left"></span>
            </button>
        </template>
        <div>
            <ul v-if="layers.length > 0" class="space-y-2">
                <LayerItem v-for="layer in layers" :key="layer.id" :layer="layer" @delete-layer="handleDeleteLayer" />
            </ul>
            <p v-else>No layers selected.</p>
        </div>

        <Panel header="Background Layer" class="mt-2">
            <ul v-if="bgLayers.length > 0" class="space-y-2">
                <LayerItem v-for="layer in bgLayers" :key="layer.id" :layer="layer" :is-bg-layer="true"/>
            </ul>
        </Panel>
    </Panel>


</template>

<style scoped>
/* Add any additional styles here */
</style>
