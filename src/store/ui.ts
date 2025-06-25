import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// Sidebar width constants
export const SIDEBAR_MIN_WIDTH = 300
export const SIDEBAR_MAX_WIDTH = 600
export const SIDEBAR_DEFAULT_WIDTH = 400

export const useUiStore = defineStore('ui', () => {
    // State
    const isLayerCartVisible = ref(false)
    const isLayerLegendVisible = ref(false)
    const isGeocatalogTreeVisible = ref(false)
    const sidebarSecondColumnWidth = ref(SIDEBAR_DEFAULT_WIDTH)

    // Getter
    const isSidebarOpen = computed(() => isLayerCartVisible.value || isGeocatalogTreeVisible.value)

    // Actions
    function setLayerCartVisible(visible: boolean) {
        isLayerCartVisible.value = visible
    }
    function setSidebarSecondColumnWidth(width: number) {
        if (width < SIDEBAR_MIN_WIDTH) {
            sidebarSecondColumnWidth.value = SIDEBAR_MIN_WIDTH
        } else if (width > SIDEBAR_MAX_WIDTH) {
            sidebarSecondColumnWidth.value = SIDEBAR_MAX_WIDTH
        } else {
            sidebarSecondColumnWidth.value = width
        }
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
        sidebarSecondColumnWidth,
        // Getter
        isSidebarOpen,
        // Actions
        setLayerCartVisible,
        setSidebarSecondColumnWidth,
        toggleLayerCart,
        setLayerLegendVisible,
        toggleLayerLegend,
        toggleGeocatalogTree,
        closeSidebar,
    }


})
