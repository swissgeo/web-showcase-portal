<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { useMainStore } from '@/store/main'

const { t } = useI18n()

const mainstore = useMainStore()
</script>

<template>
    <ul>
        <li
            v-for="layer in mainstore.layersOnMap"
            :key="layer.id"
        >
            {{ layer.name }}
        </li>
        <li v-if="mainstore.layersOnMapCount === 0">
            {{ t('Du hast zur Zeit keine Layers hinzugefügt') }}
        </li>
    </ul>
</template>
