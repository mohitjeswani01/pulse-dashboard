import { create } from 'zustand'

export interface AppNotification {
  id: string
  message: string
  at: number // epoch ms
  read: boolean
}

interface NotificationState {
  items: AppNotification[]
  push: (message: string) => void
  markAllRead: () => void
}

let seq = 0

// A couple of seeded events so the bell has history on first load. Timestamps
// are relative to load time (fine for a mock).
const seededAt = Date.now()
const seed: AppNotification[] = [
  {
    id: 'seed-wfh',
    message: 'Revised Work-From-Home policy published',
    at: seededAt - 1000 * 60 * 60 * 3,
    read: false,
  },
  {
    id: 'seed-welcome',
    message: 'Welcome to Pulse — your dashboard is ready',
    at: seededAt - 1000 * 60 * 60 * 27,
    read: false,
  },
]

/** Lightweight in-app activity feed shown in the topbar notification popover. */
export const useNotificationStore = create<NotificationState>((set) => ({
  items: seed,
  push: (message) =>
    set((state) => ({
      items: [
        { id: `n-${++seq}`, message, at: Date.now(), read: false },
        ...state.items,
      ],
    })),
  markAllRead: () =>
    set((state) => ({ items: state.items.map((i) => ({ ...i, read: true })) })),
}))
