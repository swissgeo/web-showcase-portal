// src/types/svg.d.ts
declare module '*.svg?use' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent
    export default component
}
