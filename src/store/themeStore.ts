import { create } from 'zustand'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'pulse-theme'

function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

function initialTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // localStorage unavailable — fall through to default
  }
  return 'dark'
}

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>((set, get) => {
  const theme = initialTheme()
  applyTheme(theme)

  return {
    theme,
    toggleTheme: () => {
      const next: Theme = get().theme === 'dark' ? 'light' : 'dark'
      applyTheme(next)
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // persistence is best-effort
      }
      set({ theme: next })
    },
  }
})
