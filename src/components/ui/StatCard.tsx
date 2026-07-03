import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { useCountUp } from '../../lib/useCountUp'
import { IconTile } from './Card'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: number
  /** Turn the animated numeric value into display text (default: rounded int). */
  format?: (value: number) => string
  subtext?: string
  /** Position in the row, used for the 60ms stagger. */
  index?: number
}

const defaultFormat = (value: number): string => String(Math.round(value))

export function StatCard({
  icon,
  label,
  value,
  format = defaultFormat,
  subtext,
  index = 0,
}: StatCardProps) {
  const current = useCountUp(value)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.25, ease: 'easeOut', delay: index * 0.06 },
      }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="rounded-2xl border border-line bg-surface p-5 transition-colors duration-250 hover:border-accent/40"
    >
      <IconTile icon={icon} />
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-ink-muted">
        {label}
      </p>
      <p className="mt-1 font-display text-3xl font-black tracking-tight tabular-nums">
        {format(current)}
      </p>
      {subtext && <p className="mt-1 text-xs text-ink-faint">{subtext}</p>}
    </motion.div>
  )
}
