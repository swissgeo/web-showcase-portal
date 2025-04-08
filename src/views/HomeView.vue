<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <main>
    <div>{{ t('welcome') }}</div>
  </main>
</template>
