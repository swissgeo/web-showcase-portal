<script setup lang="ts">
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import { computed, inject, onMounted, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'

import IconButton from '@/components/general/IconButton.vue'
import LucideIcon from '@/components/general/LucideIcon.vue'
import useGeocat from '@/search/geocat'
import { useTriggerSearch } from '@/search/triggerSearch.composable'
import { useMapStore } from '@/store/map'
import { useSearchStore } from '@/store/search'
import { useUiStore } from '@/store/ui'

const isDesktop = inject<boolean>('isDesktop', true)
const emits = defineEmits(['focus', 'blur'])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const inputRef = ref<any | null>(null)
const searchArea = ref<HTMLElement | null>(null)
const filterButtonReference = useTemplateRef('filterButtonReference')
defineExpose({ searchArea })

const { t } = useI18n()
const { triggerSearch } = useTriggerSearch()
const searchStore = useSearchStore()
const uiStore = useUiStore()
const geocatSearch = useGeocat()
const mapStore = useMapStore()
const isSearching = computed(() => !!searchStore.searchTerm)

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
    emits('focus')
}

const onBlur = () => {
    emits('blur')
}

onMounted(() => {
    geocatSearch.initializeGNUI()
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
</script>

<template>
    <div class="flex items-center gap-2">
        <IconField class="grow">
            <InputIcon>
                <LucideIcon
                    class="w-6 -translate-y-1"
                    name="Search"
                />
            </InputIcon>
            <InputText
                id="search"
                ref="inputRef"
                v-model="searchTerm"
                data-cy="input-search"
                class="w-full border-none shadow-none"
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
                :class="{ 'text-swissgeo-blue border-white bg-white': !uiStore.isFilterVisible }"
                :label="isDesktop ? t('filter.title') : ''"
                icon="ListFilter"
                @click="toggleFilter"
            >
            </IconButton>
        </div>
    </div>
</template>
