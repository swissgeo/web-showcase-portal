import { ref } from 'vue'

import { SIDEBAR_DEFAULT_WIDTH, SIDEBAR_MAX_WIDTH, SIDEBAR_MIN_WIDTH } from '@/store/ui'

const sidebarWidth = ref(SIDEBAR_DEFAULT_WIDTH)

export function useSidebarWidth() {
    const resetWidth = () => {
        sidebarWidth.value = SIDEBAR_DEFAULT_WIDTH
    }

    const setWidth = (width: number) => {
        const clampedWidth = Math.max(SIDEBAR_MIN_WIDTH, Math.min(width, SIDEBAR_MAX_WIDTH))
        sidebarWidth.value = clampedWidth
    }

    return {
        sidebarWidth,
        resetWidth,
        setWidth,
    }
}
