import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
    // State
    const isLayerCartVisible = ref(false)
    const isLayerLegendVisible = ref(false)
    const isGeocatalogTreeVisible = ref(false)

    // Getter
    const isSidebarOpen = computed(() => isLayerCartVisible.value || isGeocatalogTreeVisible.value)

    // Actions
    function setLayerCartVisible(visible: boolean) {
        isLayerCartVisible.value = visible
    }

    function toggleLayerCart() {
        isLayerCartVisible.value = !isLayerCartVisible.value
    }

    function setLayerLegendVisible(visible: boolean) {
        isLayerLegendVisible.value = visible
    }

    function toggleLayerLegend() {
        isLayerLegendVisible.value = !isLayerLegendVisible.value
    }
    function toggleGeocatalogTree() {
        isGeocatalogTreeVisible.value = !isGeocatalogTreeVisible.value
        // Close layer cart if geocatalog tree is opened
        if (isGeocatalogTreeVisible.value) {
            isLayerCartVisible.value = false
        }
    }
    function closeSidebar() {
        isLayerCartVisible.value = false
        isGeocatalogTreeVisible.value = false
    }

    return {
        // State
        isLayerCartVisible,
        isLayerLegendVisible,
        isGeocatalogTreeVisible,
        // Getter
        isSidebarOpen,
        // Actions
        setLayerCartVisible,
        toggleLayerCart,
        setLayerLegendVisible,
        toggleLayerLegend,
        toggleGeocatalogTree,
        closeSidebar,
    }
})
