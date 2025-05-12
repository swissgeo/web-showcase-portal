<script lang="ts" setup>
const emit = defineEmits(['click'])
</script>

<template>
    <!-- fix the height otherwise the address results and geocat results have a different height
   due to the geocat results having buttons
   -->
    <li
        class="flex h-13 cursor-pointer items-center gap-3 border-t-1 border-gray-200 text-sm md:px-4"
        @click="emit('click')"
    >
        <slot></slot>
    </li>
</template>
