<script setup lang="ts">
import { ArrowLeft, ChevronDown, X as XIcon } from 'lucide-vue-next'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import VirtualScroller from 'primevue/virtualscroller'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { FilterGroup } from '@/types/search'

import { useTriggerSearch } from '@/search/triggerSearch.composable'
import { useSearchStore } from '@/store/search'

type MultiSelectValue = number[]

const {
    modelValue,
    options,
    placeholder = '',
} = defineProps<{
    modelValue: MultiSelectValue
    options: FilterGroup[]
    placeholder?: string
}>()
const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()
const { triggerSearch } = useTriggerSearch()
const searchStore = useSearchStore()

const showOverlay = ref(false)
const search = ref('')

const currentModelValue = computed({
    get: () => [...(modelValue || [])],
    set: (val: number[]) => {
        emit('update:modelValue', [...val])
    },
})

const filteredOptions = computed(() =>
    search.value
        ? options.filter((opt) => opt.label.toLowerCase().includes(search.value.toLowerCase()))
        : options
)

const selectedLabels = computed(() =>
    options
        .filter((opt) => opt.value && (modelValue || []).includes(opt.value))
        .map((opt) => opt.label)
)

function applySelection() {
    showOverlay.value = false
    if (searchStore.searchTerm) {
        triggerSearch()
        searchStore.setIsOpenSearch(true)
    }
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
    showOverlay.value = false
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
    <div>
        <div
            class="mr-2 flex max-w-[50vw] min-w-[28vw] flex-1 cursor-pointer items-center justify-between rounded border border-gray-300 bg-white px-2 py-2 text-xs"
            @click="showOverlay = true"
        >
            <span
                v-if="!modelValue?.length"
                class="block font-bold text-nowrap"
            >
                {{ placeholder }}
            </span>
            <template v-else>
                <span class="mr-1 block font-bold">{{ placeholder }}:</span>
                <span class="block truncate text-nowrap">
                    {{ selectedLabels.slice(0, 2).join(', ') }}
                </span>
            </template>
            <XIcon
                v-if="modelValue.length"
                class="text-swissgeo-blue w-4 shrink-0"
                @click.stop="clearSelection"
            />
            <div
                v-if="modelValue.length"
                class="mx-1 w-px self-center bg-gray-300"
                style="height: 12px"
            ></div>
            <ChevronDown class="text-swissgeo-blue w-4 shrink-0" />
        </div>
        <transition name="fade">
            <div
                v-if="showOverlay"
                class="fixed inset-0 z-50 flex flex-col bg-white"
            >
                <div class="relative flex h-[50px] items-center border-b border-gray-200 p-4">
                    <Button
                        class="absolute left-4 !rounded-full !p-2"
                        aria-label="Back"
                        text
                        @click="onBack"
                    >
                        <template #icon>
                            <ArrowLeft />
                        </template>
                    </Button>
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
                            <Button
                                class="text-swissgeo-blue flex-1 border-none bg-white"
                                @click="selectAll"
                            >
                                {{ t('organisation.selectAll') }}
                            </Button>
                            <div
                                class="mx-2 w-px self-center bg-gray-300"
                                style="height: 12px"
                            ></div>
                            <Button
                                class="text-swissgeo-blue flex-1 border-none bg-white"
                                @click="clearSelection"
                            >
                                {{ t('organisation.reset') }}
                            </Button>
                        </div>
                    </div>
                    <!-- 90px for show result button, 131px for filter and select all part plus 16px padding, 50px for return part at top, 10px as extra buffer -->
                    <VirtualScroller
                        :items="filteredOptions"
                        :item-size="40"
                        :scroll-height="'calc(100vh - (90px + 131px + 50px + 10px))'"
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
                    <Button
                        class="bg-swissgeo-blue max-h-[50px] flex-1 rounded p-3 text-white"
                        @click="applySelection"
                    >
                        {{ t('organisation.showResults') }}
                    </Button>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
