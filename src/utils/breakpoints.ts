import { onBeforeMount, ref, type Ref } from 'vue'

/**
 * Extract Tailwind's breakpoints from the CSS variables
 * @returns Object with breakpoints
 */
export default function useBreakpoints() {
    const breakpoints: Ref<Record<'sm' | 'md' | 'lg' | 'xl' | '2xl', number>> = ref({
        sm: 0,
        md: 0,
        lg: 0,
        xl: 0,
        '2xl': 0,
    })

    /**
     * Retrieve the breakpoints from the variables in Tailwind
     */
    function getTwBreakpoints() {
        const style = getComputedStyle(document.documentElement)
        const fontSize = parseFloat(style.fontSize) // parse to remove the px unit

        const _get = (size: 'sm' | 'md' | 'lg' | 'xl' | '2xl') => {
            // breakpoints are in REM, therefore multiply it by the font size
            return parseFloat(style.getPropertyValue(`--breakpoint-${size}`)) * fontSize
        }

        return {
            sm: _get('sm'),
            md: _get('md'),
            lg: _get('lg'),
            xl: _get('xl'),
            '2xl': _get('2xl'),
        }
    }

    onBeforeMount(() => {
        breakpoints.value = getTwBreakpoints()
    })

    return { breakpoints }
}
