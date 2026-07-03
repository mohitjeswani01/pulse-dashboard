import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Check } from 'lucide-react'
import { useNotificationStore } from '../../store/notificationStore'
import { timeAgo } from '../../lib/utils'

const iconButtonClass =
  'relative inline-flex size-9 items-center justify-center rounded-xl text-ink-muted transition-colors duration-200 hover:bg-elevated hover:text-ink'

export function NotificationBell() {
  const items = useNotificationStore((s) => s.items)
  const markAllRead = useNotificationStore((s) => s.markAllRead)
  const unread = items.filter((i) => !i.read).length
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus() // return focus to the bell
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toggle = () => {
    const next = !open
    setOpen(next)
    if (next) markAllRead() // opening clears the unread dot
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        className={iconButtonClass}
        aria-label={
          unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'
        }
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Bell className="size-4.5" aria-hidden />
        {unread > 0 && (
          <span
            className="absolute top-2 right-2.5 size-1.5 rounded-full bg-accent"
            aria-hidden
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Notifications"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed top-[4.25rem] right-3 left-3 z-50 w-auto overflow-hidden rounded-2xl border border-line bg-elevated shadow-xl shadow-black/30 sm:absolute sm:top-full sm:left-auto sm:mt-2 sm:w-80"
          >
            <div className="border-b border-line px-4 py-3">
              <p className="font-display text-xs font-black uppercase tracking-tight">
                Notifications
              </p>
            </div>
            {items.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                <span className="flex size-9 items-center justify-center rounded-full bg-positive/10 text-positive">
                  <Check className="size-4" aria-hidden />
                </span>
                <p className="text-sm text-ink-muted">You're all caught up ✓</p>
              </div>
            ) : (
              <ul className="max-h-80 overflow-y-auto py-1">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 px-4 py-2.5 text-sm"
                  >
                    <span
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent"
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <p className="text-ink">{item.message}</p>
                      <p className="text-xs text-ink-faint">{timeAgo(item.at)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
