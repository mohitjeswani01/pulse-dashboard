import { create } from 'zustand'
import type { LeaveBalance, LeaveRequest, LeaveType } from '../types'
import {
  getLeaveBalances,
  getLeaveRequests,
  submitLeaveRequest,
  type NewLeaveRequest,
} from '../services/api'
import { istTodayIso } from '../lib/attendance'
import { useNotificationStore } from './notificationStore'

/**
 * Flip to true to exercise the failure path (rollback + error toast).
 * The mock API never rejects on its own, so the store simulates it.
 */
const SIMULATE_SUBMIT_FAILURE = false

type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

interface SubmitResult {
  ok: boolean
}

interface LeaveState {
  balances: LeaveBalance[]
  requests: LeaveRequest[]
  status: LoadStatus
  /** Id of a freshly-added request, so history can flash it once. */
  highlightId: string | null
  hydrate: (force?: boolean) => Promise<void>
  submit: (input: NewLeaveRequest) => Promise<SubmitResult>
}

let tempCounter = 0

/** Return balances with `type`'s used count shifted by `delta`. */
function adjustUsed(
  balances: LeaveBalance[],
  type: LeaveType,
  delta: number,
): LeaveBalance[] {
  return balances.map((b) =>
    b.type === type ? { ...b, used: b.used + delta } : b,
  )
}

/**
 * Single source of truth for leave balances + requests, shared by the Leave
 * page and the Dashboard (balance ring card + upcoming rail). Hydrates once;
 * submissions update it optimistically so every subscriber reflects them live.
 */
export const useLeaveStore = create<LeaveState>((set, get) => ({
  balances: [],
  requests: [],
  status: 'idle',
  highlightId: null,

  hydrate: async (force = false) => {
    const { status } = get()
    if (!force && (status === 'loading' || status === 'ready')) return
    set({ status: 'loading' })
    try {
      const [balances, requests] = await Promise.all([
        getLeaveBalances(),
        getLeaveRequests(),
      ])
      set({ balances, requests, status: 'ready' })
    } catch {
      set({ status: 'error' })
    }
  },

  submit: async (input) => {
    const tempId = `temp-${++tempCounter}`
    const optimistic: LeaveRequest = {
      ...input,
      id: tempId,
      status: 'pending',
      appliedOn: istTodayIso(),
    }

    // Optimistic: prepend the request and decrement the balance immediately.
    set((state) => ({
      requests: [optimistic, ...state.requests],
      balances: adjustUsed(state.balances, input.type, input.days),
      highlightId: tempId,
    }))

    try {
      if (SIMULATE_SUBMIT_FAILURE) {
        await new Promise((_, reject) => setTimeout(reject, 700))
      }
      const saved = await submitLeaveRequest(input)
      // Reconcile with the server record but keep the temp id as a stable
      // React key so the row doesn't remount and re-trigger its flash.
      set((state) => ({
        requests: state.requests.map((r) =>
          r.id === tempId ? { ...saved, id: tempId } : r,
        ),
      }))
      setTimeout(() => {
        set((state) =>
          state.highlightId === tempId ? { highlightId: null } : state,
        )
      }, 1600)
      useNotificationStore.getState().push('Leave request submitted')
      return { ok: true }
    } catch {
      // Rollback: drop the request and restore the balance.
      set((state) => ({
        requests: state.requests.filter((r) => r.id !== tempId),
        balances: adjustUsed(state.balances, input.type, -input.days),
        highlightId: state.highlightId === tempId ? null : state.highlightId,
      }))
      return { ok: false }
    }
  },
}))
