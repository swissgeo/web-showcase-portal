<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emits = defineEmits(['close'])
</script>

<template>
  <div class="fixed flex items-center justify-center w-full h-full inset-px">
    <div
      class="h-[90%] w-[90%] md:w-[66%] border border-solid border-black md:h-[66%] flex flex-col items-center bg-white"
    >
      <div>
        {{ t('welcome') }}
      </div>
      <div>
        {{ t('intro') }}
      </div>
      <div>
        <button @click="emits('close')">Close me</button>
      </div>
    </div>
  </div>
</template>
