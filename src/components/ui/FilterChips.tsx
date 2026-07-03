import { cn } from '../../lib/utils'

export interface FilterChip {
  value: string
  label: string
  /** Optional count shown in a small badge inside the chip. */
  count?: number
}

interface FilterChipsProps {
  chips: FilterChip[]
  value: string
  onChange: (value: string) => void
  /** Accessible name for the button group. */
  label: string
}

/** Single-select pill filter. Buttons expose aria-pressed for screen readers. */
export function FilterChips({ chips, value, onChange, label }: FilterChipsProps) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {chips.map((chip) => {
        const active = chip.value === value
        return (
          <button
            key={chip.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(chip.value)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors duration-200',
              active
                ? 'border-accent bg-accent text-white'
                : 'border-line bg-surface text-ink-muted hover:border-accent/40 hover:text-ink',
            )}
          >
            {chip.label}
            {chip.count !== undefined && (
              <span
                className={cn(
                  'rounded-full px-1.5 text-xs tabular-nums',
                  active ? 'bg-white/20 text-white' : 'bg-elevated text-ink-faint',
                )}
              >
                {chip.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
