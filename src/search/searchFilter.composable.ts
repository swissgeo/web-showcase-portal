import { computed, type ComputedRef } from 'vue'

import type { FilterGroup } from '@/types/search'

import cantons from '@/assets/cantons.json'
import municipalities from '@/assets/municipalities.json'
import { useGroupsStore } from '@/store/groups'
import { useSearchStore } from '@/store/search'
import { langToLabelKey } from '@/types/language'
import { useLanguage } from '@/utils/language.composable'

import type { GroupLabel } from './geocatGroups'

import { getKGKGroup } from './geocatGroups'

let instance: ReturnType<typeof createSearchFilter> | null = null

type municipalitiesType = (typeof municipalities)[0]

function createSearchFilter() {
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
            const mainLabel = normalizeLabel(group.label[langKey] || fallbackLabel)
            const alternativeLabels = Object.values(group.label).filter(Boolean).map(normalizeLabel)

            for (const altLabel of alternativeLabels) {
                // taking only the first occurrence of each label
                if (altLabel && !labelToGroup.has(altLabel)) {
                    labelToGroup.set(altLabel, { id: group.id, label: mainLabel })
                }
            }
        }

        const kgkGroup = getKGKGroup()
        if (kgkGroup) {
            cantons.forEach((canton) => {
                const cantonLabel = canton.label[langKey as keyof typeof canton.label] || ''
                if (!labelToGroup.has(cantonLabel)) {
                    labelToGroup.set(cantonLabel, { id: kgkGroup.id, label: cantonLabel })
                }
            })
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
        return municipalities
            .map(mapMunicipalitiesToFilterGroup(labelToGroup, langKey))
            .sort((a, b) => a.label.localeCompare(b.label))
    })

    function mapCantonToFilterGroup(
        labelMap: Map<string, { id: number; label: string }>,
        langKey: string
    ): (canton: { label: GroupLabel }) => FilterGroup {
        return (canton) => {
            const localizedLabel = normalizeLabel(canton.label[langKey] || '')
            const match = labelMap.get(localizedLabel)

            return {
                label: match?.label || localizedLabel,
                value: match?.id,
            }
        }
    }
    function mapMunicipalitiesToFilterGroup(
        labelMap: Map<string, { id: number; label: string }>,
        langKey: string
    ): (commune: municipalitiesType) => FilterGroup {
        return (commune) => {
            const match = labelMap.get(commune[langKey as keyof typeof commune])

            return {
                label: commune[langKey as keyof typeof commune] || commune.ger,
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

    const isCantonFilterActive = computed(() => selectedCantonal.value.length > 0)

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

    function normalizeLabel(label: string | undefined): string {
        if (!label) {
            return ''
        }
        return label
            .replace(/^(Canton (de|du|des|of)?|Chantun|Kanton)\s*/i, '')
            .replace(/^d'/i, '')
            .trim()
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
        isCantonFilterActive,
    }
}
// make a singleton instance of the search filter
export function useSearchFilter() {
    if (!instance) {
        instance = createSearchFilter()
    }
    return instance
}
