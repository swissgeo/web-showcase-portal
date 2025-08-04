/**
 * File containing all environment variables handling.
 */

/**
 * Object containing all environment variables.
 *
 * @type Object
 */
const environmentVariables: { [key: string]: string | number | boolean } = {
    // mapviewer embed base URL, default to the prod
    mapviewerEmbedUrl:
        import.meta.env.VITE_MAPVIEWER_BASE_EMBED_URL ?? 'https://map.geo.admin.ch/#/embed',
    api3Url: import.meta.env.VITE_API3_URL ?? 'https://sys-api3.dev.bgdi.ch',
}

/**
 * generic function to grab any environment variable
 * @type String | null
 */
export function getEnvironmentVariable(key: string) {
    return environmentVariables[key] ?? null
}

export function getEmbedViewerUrl() {
    return environmentVariables.mapviewerEmbedUrl
}

export function getApiUrl() {
    return environmentVariables.api3Url
}
