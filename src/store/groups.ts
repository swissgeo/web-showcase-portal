import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import type { Group } from '@/search/geocatGroups'

import { fetchGeocatGroups } from '@/search/geocatGroups'

export const useGroupsStore = defineStore('groups', () => {
    // State
    const groups = ref<Group[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const rawResponse = ref<unknown>(null)

    // Getter
    const groupIdsByCategory = computed(() => {
        const result: Record<string, number[]> = {}
        for (const group of groups.value) {
            const cat = group.defaultCategory?.name
            if (cat) {
                if (!result[cat]) {
                    result[cat] = []
                }
                result[cat].push(group.id)
            }
        }
        return result
    })

    // Actions
    async function loadGroups() {
        loading.value = true
        error.value = null
        try {
            const response: Group[] = await fetchGeocatGroups()
            groups.value = response
            rawResponse.value = response
        } catch (e) {
            error.value = (e as Error).message
        } finally {
            loading.value = false
        }
    }

    return {
        // State
        groups,
        loading,
        error,
        rawResponse,
        // Getter
        groupIdsByCategory,
        // Actions
        loadGroups,
    }
})
