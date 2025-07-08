<script setup lang="ts">
import { ChevronDown, X as XIcon } from 'lucide-vue-next'
import { ref, computed } from 'vue'

import type { FilterGroup } from '@/types/search'

import MobileMultiSelectOverlay from '@/components/search/MobileMultiSelectOverlay.vue'
import { useOverlay } from '@/composables/useOverlay'

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

const { showOverlay } = useOverlay()
const search = ref('')

const currentModelValue = computed({
    get: () => [...(modelValue || [])],
    set: (val: number[]) => emit('update:modelValue', [...val]),
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

function clearSelection() {
    currentModelValue.value = []
}

function openFilterOverlay() {
    showOverlay(MobileMultiSelectOverlay, {
        modelValue: currentModelValue.value,
        options: filteredOptions.value,
        placeholder: placeholder,
        onUpdateModelValue: (val: number[]) => {
            currentModelValue.value = val
        },
    })
}
</script>

<template>
    <div>
        <div
            class="mr-2 flex max-w-[50vw] min-w-[28vw] flex-1 cursor-pointer items-center justify-between rounded border border-gray-300 bg-white px-2 py-2 text-xs"
            @click="openFilterOverlay"
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
