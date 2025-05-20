<script lang="ts" setup>
import LanguageSwitchButton from '@/components/LanguageSwitchButton.vue'

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
            src="@/assets/images/pwip-logo.png"
            class="h-5"
        />
        <!-- <img
            src="@/assets/images/swissgeo_rgb_icon.svg"
            class="h-5"
        /> -->
    </div>
    <!-- the mobile one-->
    <div
        v-else
        class="flex items-center rounded border border-neutral-200 bg-white p-2 md:rounded-none md:border-none"
    >
        <div class="flex w-12 items-center justify-center">
            <img
                src="@/assets/images/pwip-logo.png"
                class="h-5"
            />
            <!-- <img
            src="@/assets/images/swissgeo_rgb_sek.svg"
            class="h-5"
        /> -->
        </div>
        <div class="text-primary-500 font-extrabold">GPS</div>
        <!-- This is the separator between the logo and the language switch button -->
        <div class="mx-3 inline-block h-5 w-0.5 bg-gray-300"></div>
        <LanguageSwitchButton :is-desktop="false" />
    </div>
</template>
