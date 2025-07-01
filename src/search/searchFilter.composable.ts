import { computed, type ComputedRef } from 'vue'

import type { FilterGroup } from '@/types/search'

import cantons from '@/assets/cantons.json'
import communes from '@/assets/communes.json'
import { useGroupsStore } from '@/store/groups'
import { useSearchStore } from '@/store/search'
import { langToLabelKey } from '@/types/language'
import { useLanguage } from '@/utils/language.composable'

import type { GroupLabel } from './geocatGroups'

export function useSearchFilter() {
    const { localeString } = useLanguage()

    const groupsStore = useGroupsStore()
    const searchStore = useSearchStore()

    const filterLanguageLabelKey = computed(() => langToLabelKey(localeString.value))

    const federalGroups = computed(() =>
        groupsStore.groups
            .filter((g) => g.defaultCategory?.name === 'federal')
            .map((g) => ({
                label: `${lastWord(g.label[filterLanguageLabelKey.value] || g.label.eng || g.name)}`,
                value: g.id,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
    )
    const cantonGroups: ComputedRef<FilterGroup[]> = computed(() => {
        const groups = groupsStore.groups
        if (!groups?.length) {
            return []
        }
        const langKey = filterLanguageLabelKey.value
        const labelToGroup = new Map<string, { id: number; label: string }>()

        for (const group of groups) {
            if (group.defaultCategory?.name !== 'cantonal') {
                continue
            }
            const fallbackLabel = group.label.eng || group.name
            const mainLabel = lastWord(group.label[langKey] || fallbackLabel)
            const alternativeLabels = Object.values(group.label).filter(Boolean).map(lastWord)

            for (const altLabel of alternativeLabels) {
                // taking only the first occurrence of each label
                // FIXME: In the geocatGroups.json Graubünden is listed twice
                if (altLabel && !labelToGroup.has(altLabel)) {
                    labelToGroup.set(altLabel, { id: group.id, label: mainLabel })
                }
            }
        }
        return cantons
            .map(mapCantonToFilterGroup(labelToGroup, langKey))
            .sort((a, b) => a.label.localeCompare(b.label))
    })

    const communalGroups: ComputedRef<FilterGroup[]> = computed(() => {
        const groups = groupsStore.groups
        if (!groups?.length) {
            return []
        }

        const langKey = filterLanguageLabelKey.value
        const labelToGroup = new Map<string, { id: number; label: string }>()

        for (const group of groups) {
            if (group.defaultCategory?.name !== 'communal') {
                continue
            }
            const fallbackLabel = group.label.eng || group.name
            const mainLabel = lastWord(group.label[langKey] || fallbackLabel)
            const alternativeLabels = Object.values(group.label).filter(Boolean).map(lastWord)
            for (const altLabel of alternativeLabels) {
                if (altLabel && !labelToGroup.has(altLabel)) {
                    labelToGroup.set(altLabel, { id: group.id, label: mainLabel })
                }
            }
        }
        return communes
            .map(mapCommuneToFilterGroup(labelToGroup))
            .sort((a, b) => a.label.localeCompare(b.label))
    })

    function mapCantonToFilterGroup(
        labelMap: Map<string, { id: number; label: string }>,
        langKey: string
    ): (canton: { label: GroupLabel }) => FilterGroup {
        return (canton) => {
            const localizedLabel = (canton.label as GroupLabel)[langKey] || ''
            const match = labelMap.get(localizedLabel)

            return {
                label: match?.label || localizedLabel,
                value: match?.id,
            }
        }
    }
    function mapCommuneToFilterGroup(
        labelMap: Map<string, { id: number; label: string }>
    ): (canton: { Gemeindename: string }) => FilterGroup {
        return (commune) => {
            const match = labelMap.get(commune.Gemeindename)
            return {
                label: match?.label || commune.Gemeindename,
                value: match?.id,
            }
        }
    }

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

    function lastWord(label: string | undefined): string {
        if (!label) {
            return ''
        }
        const words = label.trim().split(/[\s']/).filter(Boolean)
        return words[words.length - 1]
    }

    function findGroupLabel(groups: FilterGroup[], id: number): string {
        return groups.find((group: FilterGroup) => group.value === id)?.label || ''
    }

    return {
        findGroupLabel,
        filterLabelKey: filterLanguageLabelKey,
        federalGroups,
        cantonGroups,
        communalGroups,
        selectedFederal,
        selectedCantonal,
        selectedCommunal,
    }
}
