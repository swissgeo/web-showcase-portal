import { ref, shallowRef, type Ref, type ShallowRef } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OverlayComponent = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OverlayProps = Record<string, any>

const isActive: Ref<boolean> = ref(false)
const component: ShallowRef<OverlayComponent | null> = shallowRef(null)
const props: Ref<OverlayProps> = ref({})

function showOverlay(comp: OverlayComponent, compProps: OverlayProps = {}) {
    component.value = comp
    props.value = compProps
    isActive.value = true
}

function hideOverlay() {
    isActive.value = false
    component.value = null
    props.value = {}
}

export const useOverlay = () => ({
    isActive,
    component,
    props,
    showOverlay,
    hideOverlay,
})
