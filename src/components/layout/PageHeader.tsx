import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface PageHeaderProps {
  title: string
  subtitle?: string
  /** Optional right-aligned actions (buttons, filters). */
  children?: ReactNode
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="mb-8 flex flex-wrap items-end justify-between gap-4"
    >
      <div>
        <h1 className="font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {children}
    </motion.header>
  )
}
