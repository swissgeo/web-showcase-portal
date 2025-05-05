// This is needed for the svg-sprite-map plugin of vite
declare module '*.svg?use' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent
    export default component
}
