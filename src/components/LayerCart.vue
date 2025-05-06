<script setup lang="ts">
import Panel from 'primevue/panel';
import { useUiStore } from '@/store/ui';

const uiStore = useUiStore();

</script>

<template>
    <Panel
        header="Maps displayed"
        :style="{ width: '300px' }">

        <template #icons>
            <button class="p-panel-header-icon p-link mr-1 cursor-pointer" @click="uiStore.setLayerCartVisible(false)">
                <span class="pi pi-chevron-left"></span>
            </button>
        </template>
    </Panel>
</template>

<style scoped>
/* Add any additional styles here */
</style>
