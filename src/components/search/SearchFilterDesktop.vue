<script setup lang="ts">
import { useFloating, offset } from '@floating-ui/vue'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import Panel from 'primevue/panel'
import { useTemplateRef, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import FilterDropdown from '@/components/FilterDropdown.vue'
import { useSearchFilter } from '@/search/searchFilter.composable'
import { useUiStore } from '@/store/ui'

const uiStore = useUiStore()

const { t } = useI18n()

// don't destructure, so we have a bit of namespacing
const searchFilter = useSearchFilter()

const filterElement = useTemplateRef('filterElement')
const filterReference = computed(() => uiStore.filterReferenceElement)

// the dialog isn't immediately applied, so we save the values temporarily
// here
const tempSelectedFederal = ref(searchFilter.selectedFederal.value)
const tempSelectedCantonal = ref(searchFilter.selectedCantonal.value)
const tempSelectedCommunal = ref(searchFilter.selectedCommunal.value)

const { floatingStyles } = useFloating(filterReference, filterElement!, {
    placement: 'bottom-start',
    middleware: [offset(5)],
})

const selectedFederal = computed({
    get() {
        return tempSelectedFederal.value
    },
    set(value: number[]) {
        // filters are exclusive
        tempSelectedFederal.value = value ?? []
        tempSelectedCantonal.value = []
        tempSelectedCommunal.value = []
    },
})

const selectedCantonal = computed({
    get() {
        return tempSelectedCantonal.value
    },
    set(value: number[]) {
        // filters are exclusive
        tempSelectedFederal.value = []
        tempSelectedCantonal.value = value ?? []
        tempSelectedCommunal.value = []
    },
})

const selectedCommunal = computed({
    get() {
        return tempSelectedCommunal.value
    },
    set(value: number[]) {
        // filters are exclusive
        tempSelectedFederal.value = []
        tempSelectedCantonal.value = []
        tempSelectedCommunal.value = value ?? []
    },
})

function reset() {
    searchFilter.selectedFederal.value = []
    searchFilter.selectedCantonal.value = []
    searchFilter.selectedCommunal.value = []
    uiStore.toggleFilterVisible()
}

function apply() {
    if (tempSelectedFederal.value.length) {
        searchFilter.selectedFederal.value = tempSelectedFederal.value
        return uiStore.toggleFilterVisible()
    }

    if (tempSelectedCantonal.value.length) {
        searchFilter.selectedCantonal.value = tempSelectedCantonal.value
        return uiStore.toggleFilterVisible()
    }

    if (tempSelectedCommunal.value.length) {
        searchFilter.selectedCommunal.value = tempSelectedCommunal.value
        return uiStore.toggleFilterVisible()
    }

    // all must be null, which means the user applied the dialog with no filter
    // selected, meaning that they want to clear the filter
    return reset()
}
</script>

<template>
    <div>
        <!-- type checker prefers it when I do the floating on a div instead of
         the Panel directly
         -->
        <div ref="filterElement">
            <Panel
                class="z-100 border-1 border-[#1F576B] bg-white shadow"
                :style="floatingStyles"
                :header="t('filter.filterByProvider')"
                :pt="{
                    header: 'bg-neutral-100 rounded-t-lg',
                    content: 'p-0',
                }"
            >
                <div class="flex flex-col gap-6 p-4">
                    <FilterDropdown
                        v-model="selectedFederal"
                        :options="searchFilter.federalGroups.value"
                        :label="t('organisation.selectFederal')"
                        :item-label="t('organisation.category.federal_office')"
                    />
                    <FilterDropdown
                        v-model="selectedCantonal"
                        :options="searchFilter.cantonGroups.value"
                        :label="t('organisation.selectCanton')"
                        :item-label="t('organisation.category.canton')"
                    />
                    <FilterDropdown
                        v-model="selectedCommunal"
                        :options="searchFilter.communalGroups.value"
                        :label="t('organisation.selectCommune')"
                        :item-label="t('organisation.category.commune')"
                    />
                </div>
                <Divider></Divider>
                <div class="flex justify-end gap-2 px-4 py-2">
                    <Button
                        :label="t('filter.reset')"
                        severity="secondary"
                        @click="reset"
                    ></Button>
                    <Button
                        :label="t('filter.apply')"
                        @click="apply"
                    ></Button>
                </div>
            </Panel>
        </div>
    </div>
</template>
