<script setup lang="ts">
import { ArrowLeft, ChevronDown, X } from 'lucide-vue-next'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useTriggerSearch } from '@/search/triggerSearch.composable'
import { useSearchStore } from '@/store/search'

// Types for option and value
interface MultiSelectOption {
    value: number
    [key: string]: unknown
}
type MultiSelectValue = Array<number>

// Props
const props = defineProps<{
    modelValue: MultiSelectValue
    options: MultiSelectOption[]
    labelKey?: string
    placeholder?: string
}>()
const emit = defineEmits<{
    (_e: 'update:modelValue', _value: MultiSelectValue): void
    (_e: 'change', _value: MultiSelectValue): void
    (_e: 'focus'): void
    (_e: 'blur'): void
    (_e: 'back'): void
}>()
const { t } = useI18n()
const { triggerSearch } = useTriggerSearch()

const searchStore = useSearchStore()
const labelKey = props.labelKey ?? ''
const placeholder = props.placeholder ?? ''

// Mobile detection (simplified)
const isMobile = ref<boolean>(window.innerWidth < 768)
window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768
})

// Overlay
const showOverlay = ref<boolean>(false)
const search = ref<string>('')

const currentModelValue = computed({
    get() {
        return [...(props.modelValue || [])]
    },
    set(val: number[]) {
        emit('update:modelValue', [...val])
        emit('change', [...val])
    },
})

const filteredOptions = computed<MultiSelectOption[]>(() => {
    if (!search.value) return props.options
    return props.options.filter((opt) =>
        String(opt[labelKey] ?? '')
            .toLowerCase()
            .includes(search.value.toLowerCase())
    )
})

const selectedLabels = computed<string[]>(() => {
    return props.options
        .filter((opt) => (props.modelValue || []).includes(opt.value))
        .map((opt) => String(opt[labelKey]))
})

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
    currentModelValue.value = filteredOptions.value.map((opt) => opt.value)
}

function onBack() {
    emit('back')
    showOverlay.value = false
}
</script>

<template>
    <div>
        <div
            class="mr-2 mb-2 flex max-w-[50vw] min-w-[28vw] flex-1 cursor-pointer items-center justify-between rounded border border-gray-300 bg-white px-2 py-2 text-xs"
            @click="showOverlay = true"
        >
            <span
                v-if="!modelValue || !modelValue.length"
                class="block font-bold"
            >
                {{ placeholder }}
            </span>
            <template v-else>
                <span class="mr-1 block font-bold"> {{ placeholder }}:</span>
                <span class="block truncate">
                    {{ selectedLabels.slice(0, 2).join(', ') }}
                </span>
            </template>
            <div class="flex items-center gap-1">
                <X
                    v-if="modelValue.length"
                    class="w-4 text-[#1C6B85]"
                    @click.stop="clearSelection"
                />
                <div
                    v-if="modelValue.length"
                    class="mx-1 w-px self-center bg-gray-300"
                    style="height: 12px"
                ></div>
                <ChevronDown class="w-4 text-[#1C6B85]" />
            </div>
        </div>
        <!-- Full-screen Overlay -->
        <transition name="fade">
            <div
                v-if="showOverlay"
                class="fixed inset-0 z-50 flex flex-col bg-white"
            >
                <!-- Back Button at Top Left -->
                <div class="relative flex items-center border-b border-gray-200 p-4">
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
                <div class="flex-1 overflow-y-auto p-4">
                    <IconField class="mb-4 w-full">
                        <InputIcon class="pi pi-search"></InputIcon>
                        <InputText
                            id="search"
                            v-model="search"
                            data-cy="input-search"
                            class="w-full"
                            :placeholder="t('searchPlaceholder')"
                            @focus="onFocus"
                            @blur="onBlur"
                        ></InputText>
                    </IconField>
                    <div class="-center mb-4 flex gap-2 border-b border-gray-200">
                        <Button
                            class="flex-1 border-none bg-white text-[#1C6B85]"
                            @click="selectAll"
                        >
                            {{ t('organisation.selectAll') }}
                        </Button>
                        <div
                            class="mx-2 w-px self-center bg-gray-300"
                            style="height: 12px"
                        ></div>
                        <Button
                            class="flex-1 border-none bg-white text-[#1C6B85]"
                            @click="currentModelValue = []"
                        >
                            {{ t('organisation.reset') }}
                        </Button>
                    </div>

                    <div
                        v-for="option in filteredOptions"
                        :key="option.value"
                        class="flex cursor-pointer gap-2 p-2"
                        :for="option.value.toString()"
                        :class="{ 'bg-[#EBF1F3]': currentModelValue.includes(option.value) }"
                    >
                        <Checkbox
                            v-model="currentModelValue"
                            :value="option.value"
                            :input-id="option.value.toString()"
                            @click.stop
                        />
                        <label :for="option.value.toString()">{{ option.label }}</label>
                    </div>
                </div>
                <div class="flex gap-2 border-t border-gray-200 p-4">
                    <Button
                        class="flex-1 rounded bg-[#1C6B85] p-3 text-white"
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
