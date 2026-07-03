import { cn } from '../../lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-lg bg-elevated',
        '[background-image:linear-gradient(105deg,transparent_40%,var(--line)_50%,transparent_60%)]',
        '[background-size:200%_100%]',
        className,
      )}
      aria-hidden
    />
  )
}
