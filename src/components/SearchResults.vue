<script setup>
import { useSearchStore } from '@/store/search'
import AddToMapIcon from '@/assets/icons/alternate-sign-out.svg?use'
import InfoIcon from '@/assets/icons/info.svg?use'

const searchStore = useSearchStore()
</script>

<template>
  <div class="overflow-hidden">
    <ul class="mt-8 overflow-y-auto search-height-constrained md:max-h-auto">
      <li
        v-for="result in searchStore.searchResults"
        :key="result.id"
        class="flex justify-between gap-4"
      >
        <div class="flex flex-col">
          <div class="text-2xl">
            {{ result.name }}
          </div>
          <div>Lorem ipsum dolor sit mappus geoadminus et geocatus</div>
        </div>
        <div class="flex gap-2">
          <button title="Show info" class="cursor-pointer">
            <InfoIcon class="w-[32px] h-[32px] fill-current stroke-current" />
          </button>
          <button title="Add to map" class="cursor-pointer">
            <AddToMapIcon class="w-[32px] h-[32px] rotate-90 md:rotate-none" />
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
@reference "../assets/main.css";

li {
  @apply py-4 px-2;
  @apply border-b border-gray-200 border-solid;
}

.search-height-constrained {
  max-height: calc(100vh - 200px);
}
</style>
