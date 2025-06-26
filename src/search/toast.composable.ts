import { useToast as usePrimeToast } from 'primevue/usetoast'

export type ToastSeverity = 'success' | 'info' | 'warn' | 'error'
const TOAST_LIFE_MILLISECONDS = 3000

export function useToast() {
    const toast = usePrimeToast()

    function showToast(severity: ToastSeverity, summary: string, detail: string) {
        toast.add({
            severity: severity,
            summary: summary,
            detail: detail,
            group: 'bc',
            life: TOAST_LIFE_MILLISECONDS,
        })
    }

    return {
        showToast,
    }
}
