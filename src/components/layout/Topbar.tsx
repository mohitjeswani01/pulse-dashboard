import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Menu, Moon, Sun } from 'lucide-react'
import { useThemeStore } from '../../store/themeStore'
import { getInitials } from '../../lib/utils'
import { PAGE_TITLES } from './nav'

const CURRENT_USER = 'Mohit Jeswani'

const iconButtonClass =
  'relative inline-flex size-9 items-center justify-center rounded-xl text-ink-muted transition-colors duration-200 hover:bg-elevated hover:text-ink'

interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { pathname } = useLocation()
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const title = PAGE_TITLES[pathname] ?? 'Pulse'

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-line bg-canvas/80 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className={`${iconButtonClass} lg:hidden`}
        aria-label="Open navigation menu"
      >
        <Menu className="size-5" aria-hidden />
      </button>

      <h2 className="font-display text-sm font-black uppercase tracking-tight">
        {title}
      </h2>

      <div className="flex-1" />

      <button
        type="button"
        onClick={toggleTheme}
        className={iconButtonClass}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex"
          >
            {theme === 'dark' ? (
              <Moon className="size-4.5" aria-hidden />
            ) : (
              <Sun className="size-4.5" aria-hidden />
            )}
          </motion.span>
        </AnimatePresence>
      </button>

      <button type="button" className={iconButtonClass} aria-label="Notifications">
        <Bell className="size-4.5" aria-hidden />
        <span
          className="absolute top-2 right-2.5 size-1.5 rounded-full bg-accent"
          aria-hidden
        />
      </button>

      <div
        className="ml-1 flex size-9 items-center justify-center rounded-xl bg-accent text-xs font-bold text-white"
        title={CURRENT_USER}
      >
        {getInitials(CURRENT_USER)}
      </div>
    </header>
  )
}
