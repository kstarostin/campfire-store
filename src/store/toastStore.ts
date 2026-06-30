import { create } from 'zustand'

export type ToastTone = 'success' | 'error'

export interface ToastItem {
  id: string
  message: string
  tone: ToastTone
}

interface ToastState {
  toasts: ToastItem[]
  push: (message: string, tone?: ToastTone) => void
  dismiss: (id: string) => void
}

const TOAST_DURATION_MS = 4000

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: (message, tone = 'success') => {
    const id = crypto.randomUUID()
    set((state) => ({
      toasts: [...state.toasts, { id, message, tone }],
    }))

    window.setTimeout(() => {
      get().dismiss(id)
    }, TOAST_DURATION_MS)
  },
  dismiss: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }))
  },
}))
