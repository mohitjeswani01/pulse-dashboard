import { create } from 'zustand'

export interface SummaryEntry {
  summary: string
  keyUsed: 1 | 2
  at: number // epoch ms, for the "generated just now" caption
}

interface AiState {
  /** Cached summaries keyed by announcement id, or 'digest' for the daily digest. */
  entries: Record<string, SummaryEntry>
  setEntry: (key: string, entry: SummaryEntry) => void
  clear: (key: string) => void
}

/** Cache of AI summaries so repeat "Summarize" clicks are instant. */
export const useAiStore = create<AiState>((set) => ({
  entries: {},
  setEntry: (key, entry) =>
    set((state) => ({ entries: { ...state.entries, [key]: entry } })),
  clear: (key) =>
    set((state) => {
      const next = { ...state.entries }
      delete next[key]
      return { entries: next }
    }),
}))
