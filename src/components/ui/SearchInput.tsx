import { Search, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Input } from './Input'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  /** Accessible name for the input (rendered as aria-label). */
  label: string
  placeholder?: string
  className?: string
}

/** Search field with a leading icon and a clear button that appears when
 *  there's text. The orange focus ring comes from the global :focus-visible. */
export function SearchInput({
  value,
  onChange,
  label,
  placeholder,
  className,
}: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-faint"
        aria-hidden
      />
      <Input
        type="search"
        aria-label={label}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="pr-9 pl-10 [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded-lg text-ink-faint transition-colors duration-200 hover:bg-elevated hover:text-ink"
        >
          <X className="size-4" aria-hidden />
        </button>
      )}
    </div>
  )
}
