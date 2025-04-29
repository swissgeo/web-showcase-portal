<script lang="ts" setup>
const { condensed = false } = defineProps<{
    condensed?: boolean
}>()
</script>

<template>
    <img
        v-if="condensed"
        src="@/assets/images/swissgeo_farbig_klein.png"
        class=""
    />
    <img
        v-else
        src="@/assets/images/swissgeo_farbig.png"
        class="h-16"
    />
</template>
