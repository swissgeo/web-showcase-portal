export const crosshairs = ['cross', 'circle', 'bowl', 'point', 'marker'] as const

export type Crosshair = typeof crosshairs[number]

export const isCrosshair = (str: string): str is Crosshair => {
    return crosshairs.includes(str as Crosshair)
}
