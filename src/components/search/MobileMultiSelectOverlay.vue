<script setup lang="ts">
import Checkbox from 'primevue/checkbox'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import VirtualScroller from 'primevue/virtualscroller'
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import type { FilterGroup } from '@/types/search'

import IconButton from '@/components/general/IconButton.vue'
import { useOverlay } from '@/composables/useOverlay'
import { useTriggerSearch } from '@/search/triggerSearch.composable'
import { useSearchStore } from '@/store/search'

type MultiSelectValue = (number | string)[]

const {
    modelValue,
    options,
    placeholder = '',
    onUpdateModelValue,
} = defineProps<{
    modelValue: MultiSelectValue
    options: FilterGroup[]
    onUpdateModelValue: (_value: MultiSelectValue) => void
    placeholder?: string
}>()

const { t } = useI18n()
const { triggerSearch } = useTriggerSearch()
const searchStore = useSearchStore()
const { hideOverlay } = useOverlay()

const search = ref('')
const currentModelValue = ref([...(modelValue || [])])

watch(
    currentModelValue,
    (newValue) => {
        onUpdateModelValue([...newValue])
    },
    { deep: true }
)

const filteredOptions = computed(() =>
    search.value
        ? options.filter((opt) => opt.label.toLowerCase().includes(search.value.toLowerCase()))
        : options
)

function applySelection() {
    if (searchStore.searchTerm) {
        triggerSearch()
        searchStore.setIsOpenSearch(true)
    }
    hideOverlay()
}

function clearSelection() {
    currentModelValue.value = []
}

function selectAll() {
    currentModelValue.value = filteredOptions.value
        .map((opt) => opt.value)
        .filter((v) => v !== undefined)
}

function onBack() {
    hideOverlay()
}

function toggleOption(value: number | undefined) {
    if (value === undefined) {
        return
    }
    const idx = currentModelValue.value.indexOf(value)
    if (idx === -1) {
        currentModelValue.value = [...currentModelValue.value, value]
    } else {
        currentModelValue.value = [
            ...currentModelValue.value.slice(0, idx),
            ...currentModelValue.value.slice(idx + 1),
        ]
    }
}
</script>

<template>
    <div class="flex h-screen w-screen flex-col bg-white">
        <div class="flex h-[60px] items-center border-b border-gray-200 px-2 py-2">
            <IconButton
                class="rounded-md border-1 border-gray-300 text-black"
                aria-label="Back"
                text
                data-cy="button-close-search"
                icon="ChevronLeft"
                @click="onBack"
            >
            </IconButton>
            <div class="flex-1 text-center text-base font-semibold text-black">
                {{ placeholder }}
            </div>
        </div>
        <div class="flex-1 p-4">
            <div class="h-[115px] overflow-hidden">
                <IconField class="mb-4 w-full">
                    <InputIcon class="pi pi-search"></InputIcon>
                    <InputText
                        v-model="search"
                        data-cy="input-search"
                        class="w-full"
                        :placeholder="t('searchPlaceholder')"
                    />
                </IconField>
                <div class="mb-4 flex gap-2 border-b border-gray-200">
                    <IconButton
                        class="text-swissgeo-blue flex-1 border-none bg-white text-cyan-800"
                        :label="t('organisation.selectAll')"
                        @click="selectAll"
                    >
                    </IconButton>
                    <div
                        class="mx-2 w-px self-center bg-gray-300"
                        style="height: 12px"
                    ></div>
                    <IconButton
                        class="text-swissgeo-blue flex-1 border-none bg-white text-cyan-800"
                        :label="t('organisation.reset')"
                        @click="clearSelection"
                    >
                    </IconButton>
                </div>
            </div>
            <!-- 90px for the footer (50px + p-4 + gap-2), 131px for the search input and buttons (115px + p-4), 60px for the header and 10px for the bottom padding -->
            <VirtualScroller
                :items="filteredOptions"
                :item-size="40"
                :scroll-height="'calc(100vh - (90px + 131px + 60px + 10px))'"
            >
                <template #item="{ item }">
                    <div
                        :key="item.value"
                        class="flex cursor-pointer gap-2 p-2"
                        :class="{
                            'bg-swissgeo-lightblue':
                                item.value && currentModelValue.includes(item.value),
                            'cursor-not-allowed opacity-50': !item.value,
                        }"
                        @click="item.value ? toggleOption(item.value) : null"
                    >
                        <Checkbox
                            v-model="currentModelValue"
                            :value="item.value"
                            :input-id="item.value?.toString()"
                            :disabled="!item.value"
                            @click.stop
                        />
                        <label
                            :for="item.value?.toString()"
                            @click.stop
                            >{{ item.label }}</label
                        >
                    </div>
                </template>
            </VirtualScroller>
        </div>
        <div class="flex flex-1 gap-2 border-t border-gray-200 p-4">
            <IconButton
                class="bg-swissgeo-blue max-h-[50px] flex-1 rounded p-3 text-white"
                :label="t('organisation.showResults')"
                @click="applySelection"
            >
            </IconButton>
        </div>
    </div>
</template>
