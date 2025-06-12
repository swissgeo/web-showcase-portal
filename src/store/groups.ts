import { defineStore } from 'pinia'

import type { Group } from '@/search/geocatGroups'

import { fetchGeocatGroups } from '@/search/geocatGroups'

export interface GroupStoreState {
    groups: Group[]
    loading: boolean
    error: string | null
    rawResponse: unknown
}

export const useGroupsStore = defineStore('groups', {
    state: (): GroupStoreState => ({
        groups: [] as Group[],
        loading: false as boolean,
        error: null as string | null,
        rawResponse: null as unknown,
    }),
    actions: {
        async loadGroups() {
            this.loading = true
            this.error = null
            try {
                const response: Group[] = await fetchGeocatGroups()
                this.groups = response
                this.rawResponse = response
            } catch (e) {
                this.error = (e as Error).message
            } finally {
                this.loading = false
            }
        },
    },
    getters: {
        groupIdsByCategory: (state) => {
            const result: Record<string, number[]> = {}
            for (const group of state.groups) {
                const cat = group.defaultCategory?.name
                if (cat) {
                    if (!result[cat]) {
                        result[cat] = []
                    }
                    result[cat].push(group.id)
                }
            }
            return result
        },
    },
})
