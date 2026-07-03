import type { LeaveStatus } from '../../types'
import { Badge } from '../../components/ui'
import { cn } from '../../lib/utils'
import type { ComponentProps } from 'react'

type BadgeVariant = ComponentProps<typeof Badge>['variant']

const CONFIG: Record<
  LeaveStatus,
  { variant: BadgeVariant; label: string; dot: string }
> = {
  pending: { variant: 'warning', label: 'Pending', dot: 'bg-caution' },
  approved: { variant: 'success', label: 'Approved', dot: 'bg-positive' },
  rejected: { variant: 'danger', label: 'Rejected', dot: 'bg-negative' },
}

export function LeaveStatusBadge({ status }: { status: LeaveStatus }) {
  const { variant, label, dot } = CONFIG[status]
  return (
    <Badge variant={variant}>
      <span className={cn('size-1.5 rounded-full', dot)} aria-hidden />
      {label}
    </Badge>
  )
}
