<script setup lang="ts">
import { useMainStore } from '@/store/main'
import { computed, ref } from 'vue'
import ActiveLayerList from '@/components/ActiveLayerList.vue'

const mainstore = useMainStore()

const isOpen = ref(false)

const cartClasses = computed(() => {
  if (isOpen.value) {
    return ['w-full', 'md:w-[400px]', 'min-h-[200px]']
  } else {
    return ['px-8', 'py-4', 'w-auto']
  }
})

const onClick = () => {
  isOpen.value = true
}
</script>

<template>
  <div class="px-8 py-4 text-xl bg-white layer-cart fixed right-0 bottom-0" :class="cartClasses">
    <div v-if="!isOpen">
      <button @click="onClick">
        My Maps
        <div class="inline-block w-6 text-center text-white bg-red-400 rounded-full">
          {{ mainstore.layersOnMapCount }}
        </div>
      </button>
    </div>
    <div v-else>
      <ActiveLayerList></ActiveLayerList>
    </div>
  </div>
</template>

<style scoped>
.layer-cart {
  box-shadow: -5px -5px 10px 0px rgba(199, 199, 199, 1);
}
</style>
