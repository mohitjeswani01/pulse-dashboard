import type { HTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Lift + warm the border on hover (for clickable/scannable cards). */
  hover?: boolean
}

export function Card({ hover = false, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-line bg-surface',
        hover &&
          'transition-[transform,border-color] duration-250 ease-out hover:-translate-y-0.5 hover:border-accent/40',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

interface IconTileProps {
  icon: LucideIcon
  className?: string
}

/** Orange icon tile for card headers — RPS testimonial-card style. */
export function IconTile({ icon: Icon, className }: IconTileProps) {
  return (
    <div
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white',
        className,
      )}
      aria-hidden
    >
      <Icon className="size-5" strokeWidth={2} />
    </div>
  )
}
