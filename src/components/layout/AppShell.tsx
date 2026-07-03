import { useEffect, useState } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ToastViewport } from '../ui'
import { useCommandStore } from '../../store/commandStore'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { CommandPalette } from './CommandPalette'
import { PAGE_TITLES } from './nav'

export function AppShell() {
  // The drawer closes via Sidebar's onNavigate, so no route effect is needed
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const outlet = useOutlet()
  const toggleCommand = useCommandStore((s) => s.toggle)

  // Per-route document title, e.g. "Dashboard — Pulse".
  useEffect(() => {
    const title = PAGE_TITLES[location.pathname] ?? 'Not Found'
    document.title = `${title} — Pulse`
  }, [location.pathname])

  // Ctrl/Cmd+K toggles the command palette from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        toggleCommand()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [toggleCommand])

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-surface lg:flex">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              aria-hidden
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-line bg-surface lg:hidden"
            >
              <Sidebar onNavigate={() => setDrawerOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-h-screen flex-col lg:pl-64">
        <Topbar onMenuClick={() => setDrawerOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-6xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } }}
                exit={{ opacity: 0, transition: { duration: 0.12, ease: 'easeOut' } }}
              >
                {outlet}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <ToastViewport />
      <CommandPalette />
    </div>
  )
}
