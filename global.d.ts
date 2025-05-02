export {}

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
