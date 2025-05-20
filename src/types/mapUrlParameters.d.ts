import type { Crosshair } from '@/types/crosshair'
import type { Language } from '@/types/language'

export interface MapUrlParameter {
    lang: Language
    z: number
    center: SingleCoordinate
    bgLayer: string
    layers: string
    crosshair: Crosshair
    crossHairPosition: SingleCoordinate
    hideEmbedUI: boolean
}

export type SingleCoordinate = [number, number]
