import type { Language } from '@/types/language'

export interface MapUrlParameter {
    lang: Language
    z: number
    center: SingleCoordinate
    bgLayer: string
    layers: string
    crosshair: Crosshair
}

export type SingleCoordinate = [number, number]

export type Crosshair = 'cross' | 'circle' | 'bowl' | 'point' | 'marker'
