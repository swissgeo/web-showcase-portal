import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

// Adding this here as an example for later
export const SwissGeo = definePreset(Aura, {
    semantic: {
        // intermediary solution, I just took the base color
        // and increased and decreased the lightness by 5%
        primary: {
            50: 'hsl(199 46% 59%)',
            100: 'hsl(199 46% 54%)',
            200: 'hsl(199 46% 49%)',
            300: 'hsl(199 46% 44%)',
            400: 'hsl(199 46% 39%)',
            500: 'hsl(199 46% 34%)', // base color
            600: 'hsl(199 46% 29%)',
            700: 'hsl(199 46% 24%)',
            800: 'hsl(199 46% 19%)',
            900: 'hsl(199 46% 14%)',
            950: 'hsl(199 46% 9)',
        },
    },
})
