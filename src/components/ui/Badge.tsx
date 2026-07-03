import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type BadgeVariant = 'neutral' | 'success' | 'danger' | 'warning' | 'accent'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'border-line bg-elevated text-ink-muted',
  success: 'border-positive/25 bg-positive/10 text-positive',
  danger: 'border-negative/25 bg-negative/10 text-negative',
  warning: 'border-caution/25 bg-caution/10 text-caution',
  accent: 'border-accent/25 bg-accent/10 text-accent',
}

export function Badge({
  variant = 'neutral',
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}
