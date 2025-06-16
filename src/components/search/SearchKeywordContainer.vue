<script setup lang="ts">
import Tag from 'primevue/tag'
import { computed, inject, onMounted, ref, type ComputedRef, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'

import type { SearchKeywordUseCase, SearchKeywordUseCaseConfig } from '@/types/search'

import data from '@/assets/searchKeywordUseCases.json' with { type: 'json' }
import useGeocat from '@/search/geocat'
import { useSearchStore } from '@/store/search'

const keywordConfig = data as SearchKeywordUseCaseConfig
const scrollContainer = ref<HTMLElement | null>(null)

const isDesktop = inject<Ref<boolean>>('isDesktop')

const { t, locale } = useI18n()
const searchStore = useSearchStore()
const geocatSearch = useGeocat()
const searchTerm = computed(() => searchStore.searchTerm)
const isOpenSearch = computed(() => searchStore.isOpenSearch)
const isSearching = computed(() => !!searchTerm.value && (!isDesktop?.value || isOpenSearch.value))

const localeString = computed(() => {
    return locale.value.split('-')[0]
})

const visibleKeywordUseCases: ComputedRef<SearchKeywordUseCase[]> = computed(() => {
    const term = searchTerm.value?.trim().toLowerCase()
    if (!term) {
        return keywordConfig.useCases
    }
    return keywordConfig.useCases.filter((value) =>
        value.keyword?.[localeString.value].toLowerCase().includes(term)
    )
})

onMounted(() => {
    scrollContainer.value?.addEventListener('wheel', handleWheel, { passive: false })
})

function handleWheel(event: WheelEvent): void {
    if (event.deltaY === 0) {
        return
    }
    event.preventDefault()
    scrollContainer!.value!.scrollLeft += event.deltaY
}
function onClickKeyword(useCase: SearchKeywordUseCase) {
    searchStore.setSearchTerm(useCase.keyword?.[localeString.value])
    geocatSearch.searchConfigGeocat(useCase.layers)
}
</script>
<template>
    <div class="flex items-center gap-2 md:pt-4">
        <span
            v-if="!isSearching"
            class="text-sm font-medium text-nowrap text-gray-600"
        >
            {{ t('keywords.title') }}:
        </span>
        <div
            ref="scrollContainer"
            class="no-scrollbar w-full grow-0 gap-2 overflow-x-auto bg-white py-2 whitespace-nowrap md:py-0"
        >
            <Tag
                v-for="useCase in visibleKeywordUseCases"
                :key="useCase.keyword?.[localeString]"
                :pt="{
                    root: {
                        class: 'mr-2 cursor-pointer rounded-lg !border !border-gray-300 !bg-white !text-black',
                    },
                }"
                severity="secondary"
                :value="useCase.keyword?.[localeString]"
                @click="onClickKeyword(useCase)"
            ></Tag>
        </div>
    </div>
</template>
<style>
.no-scrollbar {
    scrollbar-width: none;
}
</style>
