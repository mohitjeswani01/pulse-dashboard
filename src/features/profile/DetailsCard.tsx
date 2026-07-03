import { motion } from 'framer-motion'
import { Copy, Hash, Mail, Phone, UserRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Employee } from '../../types'
import { Card } from '../../components/ui'
import { useCopyToClipboard } from '../../lib/useCopyToClipboard'

interface DetailRow {
  icon: LucideIcon
  label: string
  value: string
  copy?: boolean
}

interface DetailsCardProps {
  employee: Employee
  managerName: string
}

export function DetailsCard({ employee, managerName }: DetailsCardProps) {
  const copy = useCopyToClipboard()

  const rows: DetailRow[] = [
    { icon: Mail, label: 'Email', value: employee.email, copy: true },
    { icon: Phone, label: 'Phone', value: employee.phone, copy: true },
    { icon: Hash, label: 'Employee ID', value: employee.id.toUpperCase() },
    { icon: UserRound, label: 'Reporting manager', value: managerName },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut', delay: 0.06 }}
    >
      <Card className="h-full p-5 sm:p-6">
        <h2 className="font-display text-sm font-black uppercase tracking-tight">
          Details
        </h2>
        <dl className="mt-4 divide-y divide-line">
          {rows.map(({ icon: Icon, label, value, copy: canCopy }) => (
            <div key={label} className="flex items-center gap-3 py-3">
              <Icon className="size-4 shrink-0 text-ink-faint" aria-hidden />
              <div className="min-w-0 flex-1">
                <dt className="text-xs text-ink-faint">{label}</dt>
                <dd className="truncate text-sm text-ink">{value}</dd>
              </div>
              {canCopy && (
                <button
                  type="button"
                  onClick={() => void copy(value, `${label} copied`)}
                  aria-label={`Copy ${label.toLowerCase()}`}
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg text-ink-faint transition-colors duration-200 hover:bg-elevated hover:text-accent"
                >
                  <Copy className="size-4" aria-hidden />
                </button>
              )}
            </div>
          ))}
        </dl>
      </Card>
    </motion.div>
  )
}
