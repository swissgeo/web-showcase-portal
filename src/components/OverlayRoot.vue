<script setup lang="ts">
import { useOverlay } from '@/composables/useOverlay'

const { isActive, component, props, hideOverlay } = useOverlay()
</script>
<template>
    <transition name="fade">
        <div
            v-if="isActive"
            class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70"
            @click.self="hideOverlay"
        >
            <component
                :is="component"
                v-if="component"
                v-bind="props"
                @close="hideOverlay"
            />
        </div>
    </transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
