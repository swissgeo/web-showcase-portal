//used here just to define the iframe offset
//will no longer be useful when we no longer have iframes
import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'

export const useIframeStore = defineStore('iframe', () => {
    const dimensions = ref({ width: 1200, height: 800 })
    const paddingLeft = ref(0)

    const updateDimensions = () => {
        const iframe = document.querySelector(
            'iframe[data-cy="iframe-mapviewer"]'
        ) as HTMLElement | null
        const container = iframe?.parentElement as HTMLElement | null

        if (iframe) {
            dimensions.value = {
                width: iframe.offsetWidth,
                height: iframe.offsetHeight,
            }
        }

        if (container) {
            const computedStyle = window.getComputedStyle(container)
            paddingLeft.value = parseFloat(computedStyle.paddingLeft) || 0
        }
    }

    const observeIframe = () => {
        const iframe = document.querySelector(
            'iframe[data-cy="iframe-mapviewer"]'
        ) as HTMLElement | null
        if (!iframe) {
            return
        }

        const observer = new ResizeObserver(updateDimensions)
        observer.observe(iframe)

        return () => observer.disconnect()
    }

    onMounted(() => {
        updateDimensions()
        observeIframe()
    })

    return {
        dimensions,
        paddingLeft,
        updateDimensions,
    }
})
