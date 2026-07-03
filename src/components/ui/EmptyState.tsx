import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-line px-6 py-16 text-center',
        className,
      )}
    >
      <div
        className="flex size-12 items-center justify-center rounded-xl bg-accent/10 text-accent"
        aria-hidden
      >
        <Icon className="size-6" strokeWidth={2} />
      </div>
      <h3 className="mt-4 font-display text-base font-black uppercase tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-ink-muted">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
