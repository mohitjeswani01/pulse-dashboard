import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Moon, Search, Sun } from 'lucide-react'
import { useThemeStore } from '../../store/themeStore'
import { useCommandStore } from '../../store/commandStore'
import { getInitials } from '../../lib/utils'
import { CURRENT_USER_NAME } from '../../lib/constants'
import { NotificationBell } from './NotificationBell'
import { PAGE_TITLES } from './nav'

const iconButtonClass =
  'relative inline-flex size-9 items-center justify-center rounded-xl text-ink-muted transition-colors duration-200 hover:bg-elevated hover:text-ink'

interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { pathname } = useLocation()
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const openCommand = useCommandStore((state) => state.setOpen)
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

      {/* Command palette trigger — a wide chip on desktop, an icon on mobile. */}
      <button
        type="button"
        onClick={() => openCommand(true)}
        aria-label="Open command palette"
        aria-keyshortcuts="Control+K"
        className="hidden h-9 items-center gap-2 rounded-xl border border-line bg-surface pr-2 pl-3 text-sm text-ink-faint transition-colors duration-200 hover:border-accent/40 hover:text-ink sm:flex"
      >
        <Search className="size-4" aria-hidden />
        <span>Search…</span>
        <kbd className="rounded-md border border-line bg-elevated px-1.5 py-0.5 font-body text-[10px] font-medium text-ink-muted">
          Ctrl K
        </kbd>
      </button>
      <button
        type="button"
        onClick={() => openCommand(true)}
        className={`${iconButtonClass} sm:hidden`}
        aria-label="Open command palette"
        aria-keyshortcuts="Control+K"
      >
        <Search className="size-4.5" aria-hidden />
      </button>

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

      <NotificationBell />

      <div
        className="ml-1 flex size-9 items-center justify-center rounded-xl bg-accent text-xs font-bold text-white"
        title={CURRENT_USER_NAME}
      >
        {getInitials(CURRENT_USER_NAME)}
      </div>
    </header>
  )
}
