import { register as registerProj } from 'ol/proj/proj4'
import proj4 from 'proj4'

// Projection constants
export const EPSG_2056 = 'EPSG:2056'
export const EPSG_4326 = 'EPSG:4326'

// Swiss LV95 coordinate system definition
export const EPSG_2056_PROJ_STRING =
    '+proj=somerc +lat_0=46.9524055555556 +lon_0=7.43958333333333 +k=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs'

// WGS84 coordinate system definition
export const EPSG_4326_PROJ_STRING = '+proj=longlat +datum=WGS84 +no_defs'

// Flag to track if projections have been registered
let projectionsRegistered = false

/**
 * Register Swiss LV95 and WGS84 projections with proj4 and OpenLayers
 * This function is idempotent - it's safe to call multiple times
 */
export function registerProjections(): void {
    if (projectionsRegistered) {
        return
    }

    // Define projections in proj4
    proj4.defs(EPSG_2056, EPSG_2056_PROJ_STRING)
    proj4.defs(EPSG_4326, EPSG_4326_PROJ_STRING)

    // Register proj4 with OpenLayers
    registerProj(proj4)

    projectionsRegistered = true
}

/**
 * Ensure projections are registered and return the proj4 instance
 * @returns configured proj4 instance
 */
export function getConfiguredProj4() {
    registerProjections()
    return proj4
}

/**
 * Convert coordinates from Swiss LV95 (EPSG:2056) to WGS84 (EPSG:4326)
 * @param coord - coordinates in Swiss LV95
 * @returns coordinates in WGS84
 */
export function convertLv95ToWgs84(coord: [number, number]): [number, number] {
    const proj4 = getConfiguredProj4()
    return proj4(EPSG_2056, EPSG_4326, coord)
}
