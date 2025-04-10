import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
  state: () => {
    return {
      searchTerm: null,
      searchResults: [],
    }
  },
  actions: {
    setSearchResults(results) {
      this.searchResults = results
    },
    setSearchTerm(term) {
      this.searchTerm = term
    },
    clear() {
      this.searchResults = []
      this.searchTerm = null
    },
  },
})
