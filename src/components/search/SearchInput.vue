<script setup lang="ts">
import { ListFilter } from 'lucide-vue-next'
import Button from 'primevue/button'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import { computed, inject, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import useGeocat from '@/search/geocat'
import { useTriggerSearch } from '@/search/triggerSearch.composable'
import { useMapStore } from '@/store/map'
import { useSearchStore } from '@/store/search'
import { useUiStore } from '@/store/ui'

const isDesktop = inject<boolean>('isDesktop')

const emits = defineEmits(['focus', 'blur'])

const searchArea = ref<HTMLElement | null>(null)
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

function toggleFilter() {
    uiStore.toggleFilterVisible()
}
</script>

<template>
    <div class="flex items-center gap-2">
        <IconField class="grow">
            <InputIcon class="pi pi-search"></InputIcon>
            <InputText
                id="search"
                v-model="searchTerm"
                data-cy="input-search"
                class="w-full border-none shadow-none"
                :placeholder="t('searchPlaceholder')"
                @focus="onFocus"
                @blur="onBlur"
            ></InputText>
            <InputIcon
                v-if="isSearching"
                class="pi pi-times cursor-pointer"
                @click="clearSearch"
            />
        </IconField>
        <div
            v-if="searchStore.searchTerm && isDesktop"
            class="mx-1 w-px self-center bg-gray-300"
            style="height: 12px"
        ></div>
        <Button
            :severity="uiStore.isFilterVisible ? 'primary' : 'secondary'"
            :size="'small'"
            :class="{ 'text-swissgeo-blue border-white bg-white': !uiStore.isFilterVisible }"
            :label="isDesktop ? t('filter.title') : ''"
            @click="toggleFilter"
        >
            <template #icon>
                <ListFilter class="shrink-0 stroke-current" />
            </template>
        </Button>
    </div>
</template>
