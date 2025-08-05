<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { computed, inject, nextTick, onMounted, ref, type ComputedRef, type Ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import type { SearchKeywordUseCase, SearchKeywordUseCaseConfig } from '@/types/search'

import data from '@/assets/searchKeywordUseCases.json' with { type: 'json' }
import useGeocat from '@/search/geocat'
import { useSearchStore } from '@/store/search'
import { useUiStore } from '@/store/ui'
import { useLanguage } from '@/utils/language.composable'

const keywordConfig = data as SearchKeywordUseCaseConfig
const scrollContainer = ref<HTMLDivElement | null>(null)
const outerContainer = ref<HTMLElement | null>(null)
const showRightGradient = ref(false)
const showLeftGradient = ref(false)
const showScrollArrowRight = ref(false)
const showScrollArrowLeft = ref(false)

const isDesktop = inject<Ref<boolean>>('isDesktop')

const { t } = useI18n()
const { localeString } = useLanguage()
const searchStore = useSearchStore()
const uiStore = useUiStore()
const geocatSearch = useGeocat()
const searchTerm = computed(() => searchStore.searchTerm)
const isOpenSearch = computed(() => searchStore.isOpenSearch)
const isSearching = computed(() => !!searchTerm.value && (!isDesktop?.value || isOpenSearch.value))

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
    evaluateScrollContentPresence()
})

watch(
    () => searchStore.forceScrollComponentUpdate,
    (val) => {
        if (val) {
            evaluateScrollContentPresence()
            searchStore.setForceScrollComponentUpdate(false)
        }
    }
)

/**
 * Handle wheel scrolls on the keyword container.
 */
function handleWheel(event: WheelEvent): void {
    if (event.deltaY === 0) {
        return
    }
    const el = scrollContainer.value
    if (!el) {
        return
    }

    const isScrollable = el.scrollWidth > el.clientWidth
    if (!isScrollable) {
        return
    }
    const atStart = el.scrollLeft === 0
    const atEnd = el.scrollLeft === el.scrollWidth - el.clientWidth

    if (event.deltaY < 0) {
        // Scrolling left
        setGradientAndArrowFlags(!atStart, true, true, !atStart)
    } else if (event.deltaY > 0) {
        // Scrolling right
        setGradientAndArrowFlags(true, !atEnd, !atEnd, true)
    }

    event.preventDefault()
    el.scrollLeft += event.deltaY
}

/**
 * At startup, check if the gradient and arrow should be shown
 */
const evaluateScrollContentPresence = async () => {
    await nextTick()

    const innerEl = scrollContainer.value
    const outerEl = outerContainer.value
    if (!outerEl || !innerEl) return

    const isScrollable = innerEl.scrollWidth > innerEl.clientWidth

    if (isScrollable) {
        // If the inner content is wider than the outer container, show the right gradient and scroll arrow
        setGradientAndArrowFlags(false, true, true, false)
    } else {
        // If not scrollable, hide all gradients and arrows
        setGradientAndArrowFlags(false, false, false, false)
    }
}

const setGradientAndArrowFlags = (
    leftGradientFlag: boolean,
    rightGradientFlag: boolean,
    scrollArrowFlagRight: boolean,
    scrollArrowFlagLeft: boolean
) => {
    requestAnimationFrame(() => {
        showLeftGradient.value = leftGradientFlag
        showRightGradient.value = rightGradientFlag
        showScrollArrowRight.value = scrollArrowFlagRight
        showScrollArrowLeft.value = scrollArrowFlagLeft
    })
}

const scrollUntilEndOfList = () => {
    const el = scrollContainer.value
    if (!el) return

    el.scrollBy({
        left: el.clientWidth + el.scrollLeft,
        behavior: 'smooth',
    })

    // Delay the visibility update slightly to allow smooth scroll to finish
    // otherwise button visibility will not be updated correctly
    setTimeout(() => {
        setGradientAndArrowFlags(true, false, false, true)
    }, 100)
}

const scrollUntilBeginningOfList = () => {
    const el = scrollContainer.value
    if (!el) return

    el.scrollBy({
        left: -el.clientWidth,
        behavior: 'smooth',
    })

    // Delay the visibility update slightly to allow smooth scroll to finish
    // otherwise button visibility will not be updated correctly
    setTimeout(() => {
        evaluateScrollContentPresence()
    }, 100)
}

function onClickKeyword(useCase: SearchKeywordUseCase) {
    setGradientAndArrowFlags(false, false, false, false)
    searchStore.setSearchTerm(useCase.keyword?.[localeString.value])
    geocatSearch.searchConfigGeocat(useCase.layers)
}

// Handle the SideBar container dragging logic here
function containerStopDragging() {
    evaluateScrollContentPresence()
}
defineExpose({
    containerStopDragging,
})
</script>
<template>
    <div class="flex items-center gap-2">
        <span
            v-show="!isSearching && visibleKeywordUseCases.length"
            class="text-sm font-medium text-nowrap text-gray-600"
        >
            {{ t('keywords.title') }}:
        </span>
        <!-- Outer wrapper -->
        <div
            ref="outerContainer"
            class="relative w-full overflow-hidden"
        >
            <div
                ref="scrollContainer"
                class="no-scrollbar w-full overflow-x-auto bg-white py-2 whitespace-nowrap md:py-0"
                :class="{
                    'min-h-12': !isDesktop && !uiStore.isFilterVisible,
                }"
            >
                <!-- Inner content container that expands with tags -->
                <div class="flex w-max gap-2">
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
                    />
                </div>
            </div>

            <!-- Gradients -->
            <div
                v-if="isDesktop && showRightGradient"
                class="pointer-events-none absolute top-0 right-0 z-10 h-full w-40 bg-gradient-to-l from-white to-transparent"
            ></div>
            <div
                v-if="isDesktop && showLeftGradient"
                class="pointer-events-none absolute top-0 left-0 z-10 h-full w-40 bg-gradient-to-r from-white to-transparent"
            ></div>

            <!-- Scroll Arrow Button -->
            <Button
                v-if="isDesktop && showRightGradient && showScrollArrowRight"
                class="absolute top-1/2 right-2 z-20 -translate-y-1/2 rounded border border-transparent bg-transparent px-2 py-1 hover:bg-gray-100"
                @click="scrollUntilEndOfList"
            >
                <template #icon>
                    <ChevronRight class="h-5 w-5 text-[#1F576B]" />
                </template>
            </Button>
            <Button
                v-if="isDesktop && showLeftGradient && showScrollArrowLeft"
                class="absolute top-1/2 left-2 z-20 -translate-y-1/2 rounded border border-transparent bg-transparent px-2 py-1 hover:bg-gray-100"
                @click="scrollUntilBeginningOfList"
            >
                <template #icon>
                    <ChevronLeft class="h-5 w-5 text-[#1F576B]" />
                </template>
            </Button>
        </div>
    </div>
</template>
<style>
.no-scrollbar {
    scrollbar-width: none;
}
</style>
