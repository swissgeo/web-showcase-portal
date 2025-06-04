<script setup lang="ts">
import MultiSelect from 'primevue/multiselect'
import Tag from 'primevue/tag'
import { computed, ref, watch } from 'vue'
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

const cantonGroups = computed(() =>
  groupsStore.groups
    .filter(g => g.defaultCategory?.name === 'cantonal')
    .map(g => ({
      label: g.label[labelKey.value] || g.label.eng || g.name,
      value: g.id,
    }))
    .sort((a, b) => lastWord(a.label).localeCompare(lastWord(b.label)))
)

const federalGroups = computed(() =>
  groupsStore.groups
    .filter(g => g.defaultCategory?.name === 'federal')
    .map(g => ({
      label: g.label[labelKey.value] || g.label.eng || g.name,
      value: g.id,
    }))
    .sort((a, b) => lastWord(a.label).localeCompare(lastWord(b.label)))
)

const communalGroups = computed(() =>
  groupsStore.groups
    .filter(g => g.defaultCategory?.name === 'communal')
    .map(g => ({
      label: g.label[labelKey.value] || g.label.eng || g.name,
      value: g.id,
    }))
    .sort((a, b) => lastWord(a.label).localeCompare(lastWord(b.label)))
)

// Sélections
const selectedFederal = ref<number[]>([])
const selectedCantonal = ref<number[]>([])
const selectedCommunal = ref<number[]>([])

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

// Exposer les données nécessaires
defineExpose({
  selectedFederal,
  selectedCantonal,
  selectedCommunal,
  federalGroups,
  cantonGroups,
  communalGroups,
  lastWord,
  labelKey
})

onMounted(() => {
  groupsStore.loadGroups()
})
</script>

<template>
  <div class="mt-2 w-full flex items-center">
    <MultiSelect
      :key="federalGroups.length"
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
      class="flex-1 min-w-[100px] text-xs mb-2 mr-2"
      @focus="emit('focus')"
      @blur="emit('blur')"
    >
    </MultiSelect>
    <MultiSelect
      :key="cantonGroups.length"
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
      class="flex-1 min-w-[100px] text-xs mb-2 mr-2"
      @focus="emit('focus')"
      @blur="emit('blur')"
    >
      <template #option="{ option }">
        <span :class="selectedCantonal.includes(option.value) ? 'font-bold' : ''">
          {{ lastWord(option.label) }}
        </span>
      </template>
    </MultiSelect>
    <MultiSelect
      :key="communalGroups.length"
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
      class="flex-1 min-w-[100px] text-xs mb-2"
      @focus="emit('focus')"
      @blur="emit('blur')"
    >
      <template #option="{ option }">
        <span :class="selectedCommunal.includes(option.value) ? 'font-bold' : ''">
          {{ lastWord(option.label) }}
        </span>
      </template>
    </MultiSelect>
  </div>
  <div class="flex flex-wrap gap-2 mb-2">
    <Tag
      v-for="id in selectedFederal"
      :key="'federal-' + id"
      severity="danger"
      :value="lastWord(federalGroups.find(g => g.value === id)?.label || '')"
      class="font-bold"
      removable
      @remove="selectedFederal = []"

    />
    <Tag
      v-for="id in selectedCantonal"
      :key="'cantonal-' + id"
      severity="info"
      :value="lastWord(cantonGroups.find(g => g.value === id)?.label || '')"
      class="font-bold"
      removable
      @remove="selectedCantonal = []"
    />
    <Tag
      v-for="id in selectedCommunal"
      :key="'communal-' + id"
      severity="success"
      :value="lastWord(communalGroups.find(g => g.value === id)?.label || '')"
      class="font-bold"
      removable
      @remove="selectedCommunal = []"
    />
  </div>
</template>
