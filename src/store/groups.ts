import { defineStore } from 'pinia'

import type { Group } from '@/search/geocatGroups'

import { fetchGeocatGroups } from '@/search/geocatGroups'

export const useGroupsStore = defineStore('groups', {
    state: () => ({
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
                const response = await fetchGeocatGroups()
                this.groups = response
                this.rawResponse = response
            } catch (e) {
                this.error = (e as Error).message
            } finally {
                this.loading = false
            }
        },
    },
})
