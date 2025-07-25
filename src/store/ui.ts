import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
// Sidebar types enum
export enum SidebarType {
    LAYER_CART = 'layerCart',
    GEOCATALOG_TREE = 'geocatalogTree',
    SEARCH = 'search',
}

// Sidebar width constants
export const SIDEBAR_MIN_WIDTH = 400
// Half the window width minus some padding from side bar
export const SIDEBAR_MAX_WIDTH = window.innerWidth / 2 - 80
export const SIDEBAR_DEFAULT_WIDTH = 500

export const useUiStore = defineStore('ui', () => {
    // State
    const currentSidebar = ref<SidebarType | null>(SidebarType.SEARCH)
    const isLayerWindowVisible = ref(false)
    const isLayerWindowMaximized = ref(false)
    const openLayerWindowFromDetailButton = ref(false)
    const sidebarSecondColumnWidth = ref(SIDEBAR_DEFAULT_WIDTH)
    const isFilterVisible = ref(false)

    // Computed getters
    const isSidebarOpen = computed(() => currentSidebar.value !== null)
    const isLayerCartVisible = computed(() => currentSidebar.value === SidebarType.LAYER_CART)
    const isGeocatalogTreeVisible = computed(
        () => currentSidebar.value === SidebarType.GEOCATALOG_TREE
    )
    const isSearchVisible = computed(() => currentSidebar.value === SidebarType.SEARCH)

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

    function toggleFilterVisible() {
        isFilterVisible.value = !isFilterVisible.value
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

    function setLayerWindowVisible(visible: boolean) {
        isLayerWindowVisible.value = visible
    }

    function setMaximizedLayerWindow(visible: boolean) {
        isLayerWindowMaximized.value = visible
    }

    function setOpenLayerWindowFromDetailButton(triggered: boolean) {
        openLayerWindowFromDetailButton.value = triggered
    }

    function toggleLayerWindow() {
        isLayerWindowVisible.value = !isLayerWindowVisible.value
    }

    function closeSidebar() {
        currentSidebar.value = null
    }

    function resetStore() {
        currentSidebar.value = null
        isLayerWindowVisible.value = false
        sidebarSecondColumnWidth.value = SIDEBAR_DEFAULT_WIDTH
    }

    return {
        // State
        currentSidebar,
        isFilterVisible,
        isLayerWindowVisible,
        isLayerWindowMaximized,
        openLayerWindowFromDetailButton,
        sidebarSecondColumnWidth,
        // Computed getters
        isSidebarOpen,
        isLayerCartVisible,
        isGeocatalogTreeVisible,
        isSearchVisible,
        // Actions
        setSidebar,
        toggleSidebar,
        toggleFilterVisible,
        setLayerCartVisible,
        setSidebarSecondColumnWidth,
        setLayerWindowVisible,
        setMaximizedLayerWindow,
        setOpenLayerWindowFromDetailButton,
        toggleLayerWindow,
        closeSidebar,
        resetStore,
    }
})
