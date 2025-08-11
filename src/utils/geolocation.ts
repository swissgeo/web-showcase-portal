import { EPSG_2056, EPSG_4326, getConfiguredProj4 } from '@/config/projection.config'
import { i18n } from '@/types/language'

export interface GeolocationPosition {
    coordinates: [number, number] // [x, y] in EPSG:2056
    accuracy: number // in meters
}

export interface GeolocationError {
    code: number
    message: string
}

/**
 * Get the user's current position using the Geolocation API
 * @returns Promise that resolves to position in Swiss LV95 coordinates or rejects with error
 */
export function getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject({
                code: 0,
                message: i18n.global.t('geolocation.errorMessages.notSupported'),
            })
            return
        }

        const options: PositionOptions = {
            enableHighAccuracy: true,
            timeout: 15000, // 15 seconds
            maximumAge: 60000, // 1 minute
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                try {
                    const { latitude, longitude } = position.coords
                    // Convert from WGS84 to Swiss LV95
                    const proj4 = getConfiguredProj4()
                    const [x, y] = proj4(EPSG_4326, EPSG_2056, [longitude, latitude])

                    resolve({
                        coordinates: [x, y],
                        accuracy: position.coords.accuracy,
                    })
                } catch {
                    reject({
                        code: 1,
                        message: i18n.global.t('geolocation.errorMessages.coordinateConversion'),
                    })
                }
            },
            (error) => {
                let messageKey = 'geolocation.errorMessages.unknown'
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        messageKey = 'geolocation.errorMessages.permissionDenied'
                        break
                    case error.POSITION_UNAVAILABLE:
                        messageKey = 'geolocation.errorMessages.positionUnavailable'
                        break
                    case error.TIMEOUT:
                        messageKey = 'geolocation.errorMessages.timeout'
                        break
                }
                reject({
                    code: error.code,
                    message: i18n.global.t(messageKey),
                })
            },
            options
        )
    })
}

/**
 * Check if coordinates are within Swiss bounds
 * @param coordinates [x, y] in EPSG:2056
 * @returns true if coordinates are within Swiss territory
 */
export function isWithinSwissBounds(coordinates: [number, number]): boolean {
    const [x, y] = coordinates
    // Swiss bounds in EPSG:2056
    const SWISS_BOUNDS = {
        minX: 2485000,
        maxX: 2835000,
        minY: 1075000,
        maxY: 1295000,
    }

    return (
        x >= SWISS_BOUNDS.minX &&
        x <= SWISS_BOUNDS.maxX &&
        y >= SWISS_BOUNDS.minY &&
        y <= SWISS_BOUNDS.maxY
    )
}
