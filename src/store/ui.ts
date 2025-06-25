import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
// Sidebar types enum
export enum SidebarType {
    LAYER_CART = 'layerCart',
    GEOCATALOG_TREE = 'geocatalogTree',
}

// Sidebar width constants
export const SIDEBAR_MIN_WIDTH = 300
export const SIDEBAR_MAX_WIDTH = 600
export const SIDEBAR_DEFAULT_WIDTH = 400

export const useUiStore = defineStore('ui', () => {
    // State
    const currentSidebar = ref<SidebarType | null>(null)
    const isLayerLegendVisible = ref(false)
    const sidebarSecondColumnWidth = ref(SIDEBAR_DEFAULT_WIDTH)

    // Computed getters
    const isSidebarOpen = computed(() => currentSidebar.value !== null)
    const isLayerCartVisible = computed(() => currentSidebar.value === SidebarType.LAYER_CART)
    const isGeocatalogTreeVisible = computed(
        () => currentSidebar.value === SidebarType.GEOCATALOG_TREE
    )

    // Actions
    function setSidebar(sidebar: SidebarType | null) {
        currentSidebar.value = sidebar
    }

    function toggleSidebar(sidebar: SidebarType) {
        if (currentSidebar.value === sidebar) {
            currentSidebar.value = null
        } else {
            currentSidebar.value = sidebar
        }
    }

    function setLayerCartVisible(visible: boolean) {
        currentSidebar.value = visible ? SidebarType.LAYER_CART : null
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

    function setLayerLegendVisible(visible: boolean) {
        isLayerLegendVisible.value = visible
    }

    function toggleLayerLegend() {
        isLayerLegendVisible.value = !isLayerLegendVisible.value
    }

    function closeSidebar() {
        currentSidebar.value = null
    }

    return {
        // State
        currentSidebar,
        isLayerLegendVisible,
        sidebarSecondColumnWidth,
        // Computed getters
        isSidebarOpen,
        isLayerCartVisible,
        isGeocatalogTreeVisible,
        // Actions
        setSidebar,
        toggleSidebar,
        setLayerCartVisible,
        setSidebarSecondColumnWidth,
        setLayerLegendVisible,
        toggleLayerLegend,
        closeSidebar,
    }
})
