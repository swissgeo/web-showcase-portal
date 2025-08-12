<script setup lang="ts">
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import { computed, inject, nextTick, onMounted, ref, useTemplateRef, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'

import IconButton from '@/components/general/IconButton.vue'
import LucideIcon from '@/components/general/LucideIcon.vue'
import useGeocat from '@/search/geocat'
import { useTriggerSearch } from '@/search/triggerSearch.composable'
import { useMapStore } from '@/store/map'
import { useSearchStore } from '@/store/search'
import { useUiStore } from '@/store/ui'

const isDesktop = inject<ComputedRef<boolean>>('isDesktop')
const emits = defineEmits(['focus', 'blur'])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const inputRef = ref<any | null>(null)
const searchArea = ref<HTMLElement | null>(null)
const filterButtonReference = useTemplateRef('filterButtonReference')

const { t } = useI18n()
const { triggerSearch } = useTriggerSearch()
const searchStore = useSearchStore()
const uiStore = useUiStore()
const geocatSearch = useGeocat()
const mapStore = useMapStore()
const isSearching = computed(() => !!searchStore.searchTerm)
const isInputFocused = ref(false)
const searchTerm = computed({
    get() {
        return searchStore.searchTerm
    },
    set(value: string | null) {
        searchStore.resetSearch()
        if (value === '') {
            // if we don't do this, and the user deletes the chars in the input, then the input
            // will be '' and the search is triggered with an empty string
            value = null
            geocatSearch.cancelSearch()
            return
        }
        searchStore.setSearchTerm(value)

        if (value) {
            triggerSearch()
        }
    },
})

const onFocus = () => {
    isInputFocused.value = true
    emits('focus')
}

const onBlur = () => {
    isInputFocused.value = false
    emits('blur')
}

onMounted(() => {
    geocatSearch.initializeGNUI()
    focusInput()
})

const clearSearch = () => {
    searchStore.resetSearch()
    mapStore.setMapUrlSearchParams({
        crossHairPosition: undefined,
    })
    searchStore.setForceScrollComponentUpdate(true)
}

async function toggleFilter() {
    if (filterButtonReference.value) {
        await uiStore.setFilterReferenceElement(filterButtonReference.value)
    }
    uiStore.toggleFilterVisible()
}
function onEnter() {
    // When the user presses enter, we want to blur the input field (close the keyboard on mobile)
    if (isDesktop) {
        inputRef.value?.$el.blur()
    }
}

const focusInput = () => {
    nextTick(() => {
        if (inputRef.value && inputRef.value.$el && isDesktop?.value) {
            inputRef.value.$el.focus()
        }
    })
}

defineExpose({ searchArea, focusInput })
</script>

<template>
    <div
        class="flex items-center gap-2 rounded-lg md:h-12 md:border-1 md:border-solid"
        :class="{
            'border-1 border-[#1E485B] outline-1 outline-[#1E485B]': isInputFocused && isDesktop,
            'border-gray-300': !isInputFocused && isDesktop,
        }"
    >
        <IconField class="grow">
            <InputIcon>
                <LucideIcon
                    class="color-[#1E485B] w-4 -translate-y-1"
                    name="Search"
                />
            </InputIcon>
            <InputText
                id="search"
                ref="inputRef"
                v-model="searchTerm"
                data-cy="input-search"
                class="w-full rounded-lg border-none shadow-none"
                :placeholder="t('searchPlaceholder')"
                @focus="onFocus"
                @blur="onBlur"
                @keydown.enter="onEnter"
            ></InputText>
            <InputIcon
                v-if="isSearching"
                @click="clearSearch"
            >
                <LucideIcon
                    name="X"
                    class="w-6 -translate-y-1 cursor-pointer"
                />
            </InputIcon>
        </IconField>
        <div
            v-if="searchStore.searchTerm && isDesktop"
            class="mx-1 w-px self-center bg-gray-300"
            style="height: 12px"
        ></div>
        <div ref="filterButtonReference">
            <IconButton
                :severity="uiStore.isFilterVisible ? 'primary' : 'secondary'"
                :size="'small'"
                class="md:mr-1"
                icon-class="md:h-5"
                :class="{ 'text-swissgeo-blue border-white bg-white': !uiStore.isFilterVisible }"
                :label="isDesktop ? t('filter.title') : ''"
                icon="ListFilter"
                @click="toggleFilter"
            >
            </IconButton>
        </div>
    </div>
</template>
