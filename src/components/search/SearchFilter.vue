<script setup lang="ts">
import MultiSelect, { type MultiSelectChangeEvent } from 'primevue/multiselect'
import Tag from 'primevue/tag'
import { computed, watch } from 'vue'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import useGeocat from '@/search/geocat'
import { useGroupsStore } from '@/store/groups'
import { useSearchStore } from '@/store/search'

const { t, locale } = useI18n()
const groupsStore = useGroupsStore()
const geocatSearch = useGeocat()
const searchStore = useSearchStore()

const emit = defineEmits(['focus', 'blur'])

const { isShowTags = true } = defineProps<{
    isShowTags?: boolean
}>()

const localeString = computed(() => {
    return locale.value.split('-')[0]
})

function langToLabelKey(lang: string): string {
    if (lang === 'de') return 'ger'
    if (lang === 'fr') return 'fre'
    if (lang === 'it') return 'ita'
    if (lang === 'rm') return 'roh'
    if (lang === 'en') return 'eng'
    return 'eng'
}

const labelKey = computed(() => langToLabelKey(localeString.value))

const federalGroups = computed(() =>
    groupsStore.groups
        .filter((g) => g.defaultCategory?.name === 'federal')
        .map((g) => ({
            label: `${lastWord(g.label[labelKey.value] || g.label.eng || g.name)}`,
            value: g.id,
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
)

const cantonGroups = computed(() =>
    groupsStore.groups
        .filter((g) => g.defaultCategory?.name === 'cantonal')
        .map((g) => ({
            label: `${lastWord(g.label[labelKey.value] || g.label.eng || g.name)}`,
            value: g.id,
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
)

const communalGroups = computed(() =>
    groupsStore.groups
        .filter((g) => g.defaultCategory?.name === 'communal')
        .map((g) => ({
            label: `${lastWord(g.label[labelKey.value] || g.label.eng || g.name)}`,
            value: g.id,
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
)

const selectedFederal = computed({
    get: () => searchStore.selectedFederal,
    set: (val) => searchStore.setSelectedFederal(val),
})
const selectedCantonal = computed({
    get: () => searchStore.selectedCantonal,
    set: (val) => searchStore.setSelectedCantonal(val),
})
const selectedCommunal = computed({
    get: () => searchStore.selectedCommunal,
    set: (val) => searchStore.setSelectedCommunal(val),
})

const selectedGroupIds = computed(() => [
    ...(Array.isArray(selectedFederal.value) ? selectedFederal.value : []),
    ...(Array.isArray(selectedCantonal.value) ? selectedCantonal.value : []),
    ...(Array.isArray(selectedCommunal.value) ? selectedCommunal.value : []),
])

watch(selectedGroupIds, (ids) => {
    if (searchStore.searchTerm) {
        geocatSearch.searchGeocat(searchStore.searchTerm, ids.length ? ids : undefined)
    }
})

function lastWord(label: string): string {
    if (!label) return ''
    const words = label.trim().split(/[\s']/).filter(Boolean)
    return words[words.length - 1]
}

function changeFederal(event: MultiSelectChangeEvent) {
    if (event.value.length > 0) {
        selectedCantonal.value = []
        selectedCommunal.value = []
    }
}

function changeCommunal(event: MultiSelectChangeEvent) {
    if (event.value.length > 0) {
        selectedCantonal.value = []
        selectedFederal.value = []
    }
}

function changeCantonal(event: MultiSelectChangeEvent) {
    if (event.value.length > 0) {
        selectedFederal.value = []
        selectedCommunal.value = []
    }
}

defineExpose({
    selectedFederal,
    selectedCantonal,
    selectedCommunal,
    federalGroups,
    cantonGroups,
    communalGroups,
    lastWord,
    labelKey,
})

onMounted(() => {
    groupsStore.loadGroups()
})
</script>
<template>
    <div class="mt-2 flex w-full items-center">
        <MultiSelect
            v-model="selectedFederal"
            :max-selected-labels="0"
            :checkbox-style-class="'!border-gray-300 !bg-white !text-gray-900'"
            :checkbox-icon="'pi pi-check'"
            :filter="true"
            :filter-placeholder="t('organisation.selectFederal')"
            :filter-by="labelKey"
            :show-select-all="false"
            :options="federalGroups"
            option-label="label"
            option-value="value"
            :placeholder="t('organisation.selectFederal')"
            show-clear
            class="mr-2 mb-2 min-w-[100px] flex-1 text-xs"
            @focus="emit('focus')"
            @blur="emit('blur')"
            @change="changeFederal"
        >
        </MultiSelect>
        <MultiSelect
            v-model="selectedCantonal"
            :max-selected-labels="0"
            :checkbox-style-class="'!border-gray-300 !bg-white !text-gray-900'"
            :checkbox-icon="'pi pi-check'"
            :filter="true"
            :filter-placeholder="t('organisation.selectCanton')"
            :filter-by="labelKey"
            :show-select-all="false"
            :options="cantonGroups"
            option-label="label"
            option-value="value"
            :placeholder="t('organisation.selectCanton')"
            show-clear
            class="mr-2 mb-2 min-w-[100px] flex-1 text-xs"
            @focus="emit('focus')"
            @blur="emit('blur')"
            @change="changeCantonal"
        >
        </MultiSelect>
        <MultiSelect
            v-model="selectedCommunal"
            :max-selected-labels="0"
            :checkbox-style-class="'!border-gray-300 !bg-white !text-gray-900'"
            :checkbox-icon="'pi pi-check'"
            :filter="true"
            :filter-placeholder="t('organisation.selectCommune')"
            :filter-by="labelKey"
            :show-select-all="false"
            :options="communalGroups"
            option-label="label"
            option-value="value"
            :placeholder="t('organisation.selectCommune')"
            show-clear
            class="mb-2 min-w-[100px] flex-1 text-xs"
            @focus="emit('focus')"
            @blur="emit('blur')"
            @change="changeCommunal"
        >
        </MultiSelect>
    </div>
    <div
        v-if="isShowTags"
        class="mb-2 flex flex-wrap gap-2"
    >
        <Tag
            v-for="id in selectedFederal"
            :key="'federal-' + id"
            severity="danger"
            :value="lastWord(federalGroups.find((g) => g.value === id)?.label || '')"
            class="font-bold"
            removable
            @remove="selectedFederal = []"
        />
        <Tag
            v-for="id in selectedCantonal"
            :key="'cantonal-' + id"
            severity="info"
            :value="lastWord(cantonGroups.find((g) => g.value === id)?.label || '')"
            class="font-bold"
            removable
            @remove="selectedCantonal = []"
        />
        <Tag
            v-for="id in selectedCommunal"
            :key="'communal-' + id"
            severity="success"
            :value="lastWord(communalGroups.find((g) => g.value === id)?.label || '')"
            class="font-bold"
            removable
            @remove="selectedCommunal = []"
        />
    </div>
</template>
