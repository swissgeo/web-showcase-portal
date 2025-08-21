import { ref } from 'vue'

import { SIDEBAR_DEFAULT_WIDTH } from '@/store/ui'

const sidebarWidth = ref(SIDEBAR_DEFAULT_WIDTH)

export function useSidebarWidth() {
    const resetWidth = () => {
        sidebarWidth.value = SIDEBAR_DEFAULT_WIDTH
    }

    const setWidth = (width: number) => {
        sidebarWidth.value = width
    }

    return {
        sidebarWidth,
        resetWidth,
        setWidth,
    }
}
