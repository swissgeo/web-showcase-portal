<script lang="ts" setup>
/**
 * Button component which is basically a wrapper so we can
 * use LucideIcons instead of prime icons
 */
import Button from 'primevue/button'

import LucideIcon from '@/components/general/LucideIcon.vue'
</script>

<template>
    <Button v-bind="$attrs">
        <template #icon>
            <LucideIcon
                :class="$attrs['icon-class']"
                :name="($attrs.icon as string) ?? ''"
            ></LucideIcon>
        </template>
    </Button>
</template>
