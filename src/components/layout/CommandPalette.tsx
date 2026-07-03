import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CalendarPlus,
  CornerDownLeft,
  Search,
  Sparkles,
  SunMoon,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useCommandStore } from '../../store/commandStore'
import { useThemeStore } from '../../store/themeStore'
import { useAiStore } from '../../store/aiStore'
import { NAV_ITEMS } from './nav'
import { cn } from '../../lib/utils'

interface Command {
  id: string
  label: string
  group: string
  icon: LucideIcon
  keywords?: string
  perform: () => void
}

/** Subsequence match — "fuzzy-ish" without a dependency. */
function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase().trim()
  if (!q) return true
  const t = text.toLowerCase()
  let i = 0
  for (const ch of t) {
    if (ch === q[i]) i++
    if (i === q.length) return true
  }
  return i === q.length
}

export function CommandPalette() {
  const open = useCommandStore((s) => s.open)
  const setOpen = useCommandStore((s) => s.setOpen)

  // The dialog owns its own state and mounts fresh on each open, so there is
  // no state to reset via an effect.
  return (
    <AnimatePresence>
      {open && <PaletteDialog onClose={() => setOpen(false)} />}
    </AnimatePresence>
  )
}

function PaletteDialog({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const requestDigest = useAiStore((s) => s.requestDigest)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = NAV_ITEMS.map((item) => ({
      id: `nav-${item.to}`,
      label: `Go to ${item.label}`,
      group: 'Navigate',
      icon: item.icon,
      keywords: item.label,
      perform: () => {
        navigate(item.to)
        onClose()
      },
    }))
    const actions: Command[] = [
      {
        id: 'action-leave',
        label: 'Request leave',
        group: 'Actions',
        icon: CalendarPlus,
        keywords: 'apply time off holiday',
        perform: () => {
          navigate('/leave')
          onClose()
        },
      },
      {
        id: 'action-digest',
        label: 'Generate AI digest',
        group: 'Actions',
        icon: Sparkles,
        keywords: 'summary announcements gemini',
        perform: () => {
          requestDigest()
          navigate('/announcements')
          onClose()
        },
      },
      {
        id: 'action-theme',
        label: 'Toggle theme',
        group: 'Actions',
        icon: SunMoon,
        keywords: 'dark light mode',
        perform: () => {
          toggleTheme()
          onClose()
        },
      },
    ]
    return [...nav, ...actions]
  }, [navigate, onClose, toggleTheme, requestDigest])

  const results = useMemo(
    () => commands.filter((c) => fuzzyMatch(query, `${c.label} ${c.keywords ?? ''}`)),
    [commands, query],
  )

  // DOM-only side effects (no setState) — focus on mount, keep active visible.
  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(results.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      results[active]?.perform()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-label="Command palette"
        aria-modal="true"
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-elevated shadow-2xl shadow-black/40"
      >
        <div className="flex items-center gap-2.5 border-b border-line px-4">
          <Search className="size-4 shrink-0 text-ink-faint" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            onKeyDown={onKeyDown}
            placeholder="Search commands…"
            aria-label="Search commands"
            className="h-12 w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
          />
        </div>

        <ul ref={listRef} className="max-h-72 overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-ink-muted">
              No commands match "{query}"
            </li>
          ) : (
            results.map((command, i) => {
              const Icon = command.icon
              const isActive = i === active
              return (
                <li key={command.id}>
                  <button
                    type="button"
                    data-active={isActive}
                    onMouseMove={() => setActive(i)}
                    onClick={() => command.perform()}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-left text-sm transition-colors',
                      isActive
                        ? 'border-accent bg-accent/12 text-ink'
                        : 'border-transparent text-ink-muted hover:bg-surface',
                    )}
                  >
                    <Icon
                      className={cn(
                        'size-4 shrink-0',
                        isActive ? 'text-accent' : 'text-ink-faint',
                      )}
                      aria-hidden
                    />
                    <span className="flex-1">{command.label}</span>
                    <span className="text-[10px] uppercase tracking-wide text-ink-faint">
                      {command.group}
                    </span>
                    {isActive && (
                      <CornerDownLeft className="size-3.5 text-ink-faint" aria-hidden />
                    )}
                  </button>
                </li>
              )
            })
          )}
        </ul>
      </motion.div>
    </motion.div>
  )
}
