import proj4 from 'proj4'

// Swiss LV95 coordinate system definition
const EPSG_2056_PROJ_STRING =
    '+proj=somerc +lat_0=46.9524055555556 +lon_0=7.43958333333333 +k=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs'
const EPSG_2056 = 'EPSG:2056'
const EPSG_4326 = 'EPSG:4326' // WGS84

// Define the projections
proj4.defs(EPSG_2056, EPSG_2056_PROJ_STRING)
proj4.defs(EPSG_4326, '+proj=longlat +datum=WGS84 +no_defs')

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
                message: 'Geolocation is not supported by this browser',
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
                    const [x, y] = proj4(EPSG_4326, EPSG_2056, [longitude, latitude])

                    resolve({
                        coordinates: [x, y],
                        accuracy: position.coords.accuracy,
                    })
                } catch {
                    reject({
                        code: 1,
                        message: 'Failed to convert coordinates',
                    })
                }
            },
            (error) => {
                let message = 'Unknown geolocation error'
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = 'Geolocation permission denied'
                        break
                    case error.POSITION_UNAVAILABLE:
                        message = 'Geolocation position unavailable'
                        break
                    case error.TIMEOUT:
                        message = 'Geolocation request timed out'
                        break
                }
                reject({
                    code: error.code,
                    message,
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
