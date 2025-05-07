<script setup lang="ts">
import { defineProps } from 'vue';

// Define props for the LayerItem component
const props = defineProps({
    layer: {
        type: Object,
        required: true,
    },
});

// Method to toggle visibility
const toggleVisibility = () => {
    props.layer.visible = !props.layer.visible;
};
</script>

<template>
    <li class="flex justify-between items-center p-2 bg-white shadow rounded-md border">
        <div class="flex items-center space-x-2">
            <button @click="toggleVisibility" class="cursor-pointer">
                <span v-if="layer.visible" class="pi pi-eye text-black"></span>
                <span v-else class="pi pi-eye-slash text-gray-400"></span>
            </button>
            <span :class="{'line-through text-gray-400': !layer.visible}" class="text-sm font-medium">{{ layer.name }}</span>
        </div>
        <div v-if="layer.visible" class="flex items-center space-x-2">
            <span class="text-sm font-medium bg-gray-100 px-2 py-1 rounded">{{ Math.round((layer.opacity || 1) * 100) }}%</span>
            <button class="cursor-pointer">
                <span class="pi pi-ellipsis-v text-gray-500"></span>
            </button>
        </div>
    </li>
</template>

<style scoped>
/* Add any additional styles here */
</style>
