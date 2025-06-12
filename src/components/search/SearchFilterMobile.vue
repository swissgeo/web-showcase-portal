<script setup lang="ts">
import { computed, watch } from 'vue'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import MobileFullScreenMultiSelect from '@/components/search/MobileFullScreenMultiSelect.vue'
import useGeocat from '@/search/geocat'
import { useGroupsStore } from '@/store/groups'
import { useSearchStore } from '@/store/search'

const { t, locale } = useI18n()
const groupsStore = useGroupsStore()
const geocatSearch = useGeocat()
const searchStore = useSearchStore()

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
    set: (val) => {
        searchStore.setSelectedCantonal([])
        searchStore.setSelectedCommunal([])
        searchStore.setSelectedFederal(val)
    },
})
const selectedCantonal = computed({
    get: () => searchStore.selectedCantonal,
    set: (val) => {
        searchStore.setSelectedFederal([])
        searchStore.setSelectedCommunal([])
        searchStore.setSelectedCantonal(val)
    },
})
const selectedCommunal = computed({
    get: () => searchStore.selectedCommunal,
    set: (val) => {
        searchStore.setSelectedCantonal([])
        searchStore.setSelectedFederal([])
        searchStore.setSelectedCommunal(val)
    },
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
    <div class="mt-2 flex w-full items-center overflow-x-auto">
        <MobileFullScreenMultiSelect
            v-model="selectedFederal"
            :options="federalGroups"
            :placeholder="t('organisation.category.federation')"
            :label-key="'label'"
        />
        <MobileFullScreenMultiSelect
            v-model="selectedCantonal"
            :options="cantonGroups"
            :placeholder="t('organisation.category.canton')"
            :label-key="'label'"
        />
        <MobileFullScreenMultiSelect
            v-model="selectedCommunal"
            :options="communalGroups"
            :placeholder="t('organisation.category.commune')"
            :label-key="'label'"
        />
    </div>
</template>
