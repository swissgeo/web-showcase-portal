<script setup lang="ts">
import { RouterView } from 'vue-router'

import OverlayRoot from '@/components/OverlayRoot.vue'
</script>

<template>
    <header>
        <div class="wrapper">
            <nav></nav>
        </div>
    </header>

    <RouterView />
    <OverlayRoot />
</template>

<style scoped></style>
