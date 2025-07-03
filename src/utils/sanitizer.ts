import sanitizeHtml from 'sanitize-html'

// config which allows
const config = {
    allowedAttributes: {
        a: ['href', 'target'],
    },
    allowedSchemes: ['https'],
    transformTags: {
        // @ts-expect-error I don't want to enforce a strict attributes typing for an entire configuration dictionary when I only need to change one of them
        a: function (tagName: string, attribs) {
            if (!attribs.target) {
                attribs.target = '_blank'
            }
            return {
                tagName,
                attribs,
            }
        },
    },
}

/**
 *
 * @param text the text in which there might be html content you want to sanitize
 * @returns a sanitized text which might contain html
 */
export function sanitize(text: string | undefined): string | undefined {
    if (text) {
        return sanitizeHtml(text, config)
    }
    return undefined
}
