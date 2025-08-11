import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
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
const LAYER_WINDOW_START_POSITION = { x: -1000, y: -1000 }
const layerWindowLastPosition = ref(LAYER_WINDOW_START_POSITION)

export const useUiStore = defineStore('ui', () => {
    // State
    const currentSidebar = ref<SidebarType | null>(SidebarType.SEARCH)
    const isLayerWindowVisible = ref(false)
    const isLayerWindowMaximized = ref(false)
    const openLayerWindowFromDetailButton = ref(false)
    const sidebarSecondColumnWidth = ref(SIDEBAR_DEFAULT_WIDTH)
    const isFilterVisible = ref(false)
    const filterReferenceElement: Ref<HTMLElement | null> = ref(null)

    // Welcome overlay state
    const isWelcomeOverlayVisible = ref(false)
    const dontShowWelcomeOverlayAgain = useStorage('dontShowWelcomeOverlayAgain', false)
    const dontShowAgainCheckbox = ref(false)

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

    function setFilterReferenceElement(elem: HTMLElement) {
        filterReferenceElement.value = elem
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

    function setLayerWindowLastPosition(x: number, y: number) {
        layerWindowLastPosition.value = { x, y }
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

    // Welcome overlay actions
    function showWelcomeOverlay() {
        isWelcomeOverlayVisible.value = true
    }

    function hideWelcomeOverlay() {
        isWelcomeOverlayVisible.value = false
        dontShowAgainCheckbox.value = false
    }

    function hideWelcomeOverlayPermanently() {
        dontShowWelcomeOverlayAgain.value = true
        isWelcomeOverlayVisible.value = false
        dontShowAgainCheckbox.value = false
    }

    function shouldShowOverlayOnInit(): boolean {
        return !dontShowWelcomeOverlayAgain.value
    }

    function initializeWelcomeOverlay() {
        if (shouldShowOverlayOnInit()) {
            showWelcomeOverlay()
        }
    }

    function resetStore() {
        currentSidebar.value = SidebarType.SEARCH
        isLayerWindowMaximized.value = false
        isFilterVisible.value = false
        isLayerWindowVisible.value = false
        sidebarSecondColumnWidth.value = SIDEBAR_DEFAULT_WIDTH
        isWelcomeOverlayVisible.value = false
        dontShowAgainCheckbox.value = false
        layerWindowLastPosition.value = LAYER_WINDOW_START_POSITION
    }

    return {
        // State
        currentSidebar,
        isFilterVisible,
        filterReferenceElement,
        isLayerWindowVisible,
        isLayerWindowMaximized,
        layerWindowLastPosition,
        openLayerWindowFromDetailButton,
        sidebarSecondColumnWidth,
        isWelcomeOverlayVisible,
        dontShowAgainCheckbox,
        dontShowWelcomeOverlayAgain,
        // Computed getters
        isSidebarOpen,
        isLayerCartVisible,
        isGeocatalogTreeVisible,
        isSearchVisible,
        // Actions
        setSidebar,
        toggleSidebar,
        toggleFilterVisible,
        setFilterReferenceElement,
        setLayerCartVisible,
        setSidebarSecondColumnWidth,
        setLayerWindowVisible,
        setLayerWindowLastPosition,
        setMaximizedLayerWindow,
        setOpenLayerWindowFromDetailButton,
        toggleLayerWindow,
        closeSidebar,
        resetStore,
        // Welcome overlay actions
        showWelcomeOverlay,
        hideWelcomeOverlay,
        hideWelcomeOverlayPermanently,
        shouldShowOverlayOnInit,
        initializeWelcomeOverlay,
    }
})
