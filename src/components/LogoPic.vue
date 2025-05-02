<script lang="ts" setup>
const { condensed = false } = defineProps<{
    condensed?: boolean
}>()
</script>

<template>
    <!-- the desktop icon in the sidebar -->
    <div
        v-if="condensed"
        class="flex h-12 w-full items-center justify-center"
    >
        <img
            src="@/assets/images/swissgeo_rgb_icon.svg"
            class="h-5"
        />
    </div>
    <!-- the mobile one-->
    <div
        v-else
        class="rounded border border-neutral-200 bg-white p-2"
    >
        <img
            src="@/assets/images/swissgeo_rgb_sek.svg"
            class="h-5"
        />
    </div>
</template>
