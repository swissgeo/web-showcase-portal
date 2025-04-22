/// <reference types="vite/client" />

declare global {
    interface Window {
        GNUI: {
            init(string): void
            recordsRepository: {
                search(object)
            }
        }
    }
}

window.GNUI = window.GNUI || {}
