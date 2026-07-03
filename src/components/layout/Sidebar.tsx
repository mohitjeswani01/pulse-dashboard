import { useId } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { NAV_ITEMS } from './nav'

interface SidebarProps {
  /** Called after a nav item is clicked (used to close the mobile drawer). */
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: SidebarProps) {
  // Unique per instance so desktop sidebar and mobile drawer indicators
  // never share a framer-motion layoutId.
  const indicatorId = useId()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-line px-6">
        <span className="size-3 rounded-xs bg-accent" aria-hidden />
        <span className="font-display text-lg font-black uppercase tracking-tight">
          Pulse
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Main">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200',
                isActive
                  ? 'bg-elevated text-accent'
                  : 'text-ink-muted hover:bg-elevated/60 hover:text-ink',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId={indicatorId}
                    className="absolute top-2 bottom-2 left-0 w-[3px] rounded-full bg-accent"
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    aria-hidden
                  />
                )}
                <Icon className="size-4.5 shrink-0" strokeWidth={2} aria-hidden />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line px-6 py-4">
        <p className="text-xs text-ink-faint">© 2026 Pulse HQ</p>
      </div>
    </div>
  )
}
