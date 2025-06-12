import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { FilterGroup } from '@/types/search'

import { useGroupsStore } from '@/store/groups'
import { useSearchStore } from '@/store/search'

export function useSearchFilter() {
    const { locale } = useI18n()
    const groupsStore = useGroupsStore()
    const searchStore = useSearchStore()

    const localeString = computed(() => {
        return locale.value.split('-')[0]
    })

    const filterLabelKey = computed(() => langToLabelKey(localeString.value))

    const federalGroups = computed(() =>
        groupsStore.groups
            .filter((g) => g.defaultCategory?.name === 'federal')
            .map((g) => ({
                label: `${lastWord(g.label[filterLabelKey.value] || g.label.eng || g.name)}`,
                value: g.id,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
    )

    const cantonGroups = computed(() =>
        groupsStore.groups
            .filter((g) => g.defaultCategory?.name === 'cantonal')
            .map((g) => ({
                label: `${lastWord(g.label[filterLabelKey.value] || g.label.eng || g.name)}`,
                value: g.id,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
    )

    const communalGroups = computed(() =>
        groupsStore.groups
            .filter((g) => g.defaultCategory?.name === 'communal')
            .map((g) => ({
                label: `${lastWord(g.label[filterLabelKey.value] || g.label.eng || g.name)}`,
                value: g.id,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
    )

    const selectedFederal = computed({
        get: () => searchStore.selectedFederalIds,
        set: (val) => searchStore.setSelectedFederalIds(val || []),
    })
    const selectedCantonal = computed({
        get: () => searchStore.selectedCantonalIds,
        set: (val) => searchStore.setSelectedCantonalIds(val || []),
    })
    const selectedCommunal = computed({
        get: () => searchStore.selectedCommunalIds,
        set: (val) => searchStore.setSelectedCommunalIds(val || []),
    })

    function lastWord(label: string): string {
        if (!label) return ''
        const words = label.trim().split(/[\s']/).filter(Boolean)
        return words[words.length - 1]
    }

    function findGroupLabel(groups: FilterGroup[], id: number): string {
        return groups.find((group: FilterGroup) => group.value === id)?.label || ''
    }

    function langToLabelKey(lang: string): string {
        if (lang === 'de') return 'ger'
        if (lang === 'fr') return 'fre'
        if (lang === 'it') return 'ita'
        if (lang === 'rm') return 'roh'
        if (lang === 'en') return 'eng'
        return 'eng'
    }

    return {
        findGroupLabel,
        filterLabelKey,
        federalGroups,
        cantonGroups,
        communalGroups,
        selectedFederal,
        selectedCantonal,
        selectedCommunal,
    }
}
