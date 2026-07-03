import { useState } from 'react'
import { useAiStore } from '../../store/aiStore'
import { useToastStore } from '../../store/toastStore'
import { useNotificationStore } from '../../store/notificationStore'

type Mode = 'single' | 'digest'

interface SummarizePayload {
  text: string
  mode: Mode
}

interface SummarizeResponse {
  summary?: string
  keyUsed?: 1 | 2
}

/**
 * The single place all AI summary calls flow through: it reads/writes the
 * aiStore cache, owns per-consumer loading/error state, and hits the serverless
 * function. `cacheKey` is the announcement id (or 'digest').
 */
export function useSummarize(cacheKey: string) {
  const entry = useAiStore((s) => s.entries[cacheKey])
  const setEntry = useAiStore((s) => s.setEntry)
  const pushToast = useToastStore((s) => s.push)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  /** Run a summary. Cached results return instantly unless `force` bypasses it. */
  const run = async (
    payload: SummarizePayload,
    options?: { force?: boolean },
  ): Promise<void> => {
    if (!options?.force && entry) return
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`request failed (${res.status})`)
      const data = (await res.json()) as SummarizeResponse
      if (!data.summary) throw new Error('empty summary')
      setEntry(cacheKey, {
        summary: data.summary,
        keyUsed: data.keyUsed ?? 1,
        at: Date.now(),
      })
      useNotificationStore
        .getState()
        .push(cacheKey === 'digest' ? 'AI digest generated' : 'Announcement summarized')
    } catch {
      // Provider details never reach here — we only ever see our own generic
      // failure. Surface a toast + inline state, never crash.
      setError(true)
      pushToast('AI summary failed — please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return { entry, summary: entry?.summary, loading, error, run }
}
