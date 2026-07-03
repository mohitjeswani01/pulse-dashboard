import { cn, getInitials } from '../../lib/utils'

/** Deterministic gradient angle from a name, so each person's orange→amber
 *  tile is stable and distinct while staying on-brand. */
function angleFor(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  }
  return hash % 360
}

interface AvatarProps {
  name: string
  className?: string
}

export function Avatar({ name, className }: AvatarProps) {
  return (
    <div
      className={cn(
        'flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white',
        'ring-2 ring-transparent transition-shadow duration-200 group-hover:ring-accent/50',
        className,
      )}
      style={{ backgroundImage: `linear-gradient(${angleFor(name)}deg, #FF5C00, #FFB800)` }}
      aria-hidden
    >
      {getInitials(name)}
    </div>
  )
}
