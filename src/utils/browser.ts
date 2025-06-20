/**
 *
 * @returns True if the browser is Firefox on a mobile device
 */
export function isFirefoxMobile(): boolean {
    const ua = navigator.userAgent
    const isAndroidFirefox = /Firefox/i.test(ua) && /Android/i.test(ua)
    const isiOSFirefox = /FxiOS/i.test(ua) && /(iPhone|iPad)/i.test(ua)

    return isAndroidFirefox || isiOSFirefox
}
