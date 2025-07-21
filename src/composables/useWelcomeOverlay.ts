import { useStorage } from '@vueuse/core'
import { ref } from 'vue'

/**
 * Composable for managing welcome overlay state and persistence
 */
export function useWelcomeOverlay() {
    // Persistent storage for user's "don't show again" preference
    const dontShowWelcomeOverlayAgain = useStorage('dontShowWelcomeOverlayAgain', false)

    // Local state for overlay visibility
    const isWelcomeOverlayVisible = ref(false)

    // Temporary checkbox state (separate from persistent storage)
    const dontShowAgainCheckbox = ref(false)

    /**
     * Show the welcome overlay
     */
    function showWelcomeOverlay() {
        isWelcomeOverlayVisible.value = true
    }

    /**
     * Hide the welcome overlay without saving preference
     */
    function hideWelcomeOverlay() {
        isWelcomeOverlayVisible.value = false
        dontShowAgainCheckbox.value = false // Reset checkbox state
    }

    /**
     * Hide the welcome overlay and save the "don't show again" preference
     */
    function hideWelcomeOverlayPermanently() {
        dontShowWelcomeOverlayAgain.value = true
        isWelcomeOverlayVisible.value = false
        dontShowAgainCheckbox.value = false // Reset checkbox state
    }

    /**
     * Check if overlay should be shown on app initialization
     */
    function shouldShowOverlayOnInit(): boolean {
        return !dontShowWelcomeOverlayAgain.value
    }

    /**
     * Initialize overlay visibility based on user preference
     */
    function initializeOverlay() {
        if (shouldShowOverlayOnInit()) {
            showWelcomeOverlay()
        }
    }

    return {
        // State
        isWelcomeOverlayVisible,
        dontShowAgainCheckbox,
        dontShowWelcomeOverlayAgain,

        // Actions
        showWelcomeOverlay,
        hideWelcomeOverlay,
        hideWelcomeOverlayPermanently,
        shouldShowOverlayOnInit,
        initializeOverlay,
    }
}
