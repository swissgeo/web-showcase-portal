<script setup>
import SearchUse from '@/assets/icons/search.svg?use'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <div class="relative">
    <input :placeholder="t('searchPlaceholder')" class="text-2xl" />
    <div class="absolute right-0 top-0 py-2 pr-2">
      <SearchUse class="h-[32px] w-[32px] fill-neutral-400 stroke-neutral-400" />
    </div>
  </div>
</template>
