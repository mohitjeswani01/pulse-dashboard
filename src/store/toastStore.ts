import { create } from 'zustand'
import type { Toast } from '../types'

const AUTO_DISMISS_MS = 4000

let toastCounter = 0

interface ToastState {
  toasts: Toast[]
  push: (message: string, variant?: Toast['variant']) => void
  dismiss: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (message, variant = 'info') => {
    const id = `toast-${++toastCounter}`
    set((state) => ({ toasts: [...state.toasts, { id, message, variant }] }))
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, AUTO_DISMISS_MS)
  },
  dismiss: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
  },
}))
