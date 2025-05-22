<script lang="ts" setup>
import { inject } from 'vue'

import LanguageSwitchButton from '@/components/LanguageSwitchButton.vue'

const { condensed = false } = defineProps<{
    condensed?: boolean
}>()

const isDesktop = inject<boolean>('isDesktop')
</script>

<template>
    <!-- the desktop icon in the sidebar -->
    <div
        v-if="condensed"
        class="flex h-14 w-full items-center justify-center"
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
    <!-- the mobile one and when the sidebar is extended -->
    <div
        v-else
        class="flex h-14 items-center rounded border border-neutral-200 bg-white md:rounded-none md:border-none"
    >
        <!--
        include this for the real version
        <div class="ml-3.5 flex translate-x-[0.5px] items-center justify-center p-2">
            <img
                src="@/assets/images/swissgeo_rgb_sek.svg"
                class="h-5"
            />
        </div> -->

        <!--- remove from here -->
        <div class="flex w-[75px] items-center justify-center gap-2">
            <img
                src="@/assets/images/pwip-logo.png"
                class="h-5"
            />
        </div>
        <div class="text-primary-500 font-extrabold">GPS</div>
        <!-- to here for the uncensored version -->

        <div
            v-if="!isDesktop"
            class="flex items-center"
        >
            <!-- This is the separator between the logo and the language switch button -->
            <div class="mx-3 inline-block h-5 w-0.5 bg-gray-300"></div>
            <LanguageSwitchButton :is-desktop="false" />
        </div>
    </div>
</template>
