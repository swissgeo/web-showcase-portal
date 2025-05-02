/// <reference types="vite/client" />

export {}

declare global {
    interface Window {
        // needed for the geocat search
        GNUI: {
            init(string): void
            recordsRepository: {
                search(object)
            }
        }
    }
}
