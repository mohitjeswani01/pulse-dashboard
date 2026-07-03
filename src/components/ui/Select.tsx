import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent, Ref } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  invalid?: boolean
  id?: string
  describedBy?: string
  buttonRef?: Ref<HTMLButtonElement>
}

/** Custom listbox Select — fully keyboard-navigable, dark-styled. */
export function Select({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  invalid,
  id,
  describedBy,
  buttonRef,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const openList = () => {
    setActiveIndex(Math.max(0, options.findIndex((o) => o.value === value)))
    setOpen(true)
  }

  const choose = (index: number) => {
    const opt = options[index]
    if (opt) {
      onChange(opt.value)
      setOpen(false)
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        openList()
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((i) => Math.min(options.length - 1, i + 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((i) => Math.max(0, i - 1))
        break
      case 'Home':
        e.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        e.preventDefault()
        setActiveIndex(options.length - 1)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        choose(activeIndex)
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        break
      case 'Tab':
        setOpen(false)
        break
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        id={id}
        ref={buttonRef}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        aria-activedescendant={
          open && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined
        }
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={cn(
          'flex h-11 w-full items-center justify-between rounded-xl border bg-canvas px-3.5 text-sm',
          'transition-colors duration-200 focus:border-accent/50',
          invalid
            ? 'border-negative/40'
            : 'border-line hover:border-ink-faint/50',
          selected ? 'text-ink' : 'text-ink-faint',
        )}
      >
        {selected ? selected.label : placeholder}
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-ink-muted transition-transform duration-200',
            open && 'rotate-180',
          )}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-line bg-elevated p-1 shadow-lg shadow-black/30"
          >
            {options.map((opt, i) => (
              <li
                key={opt.value}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={opt.value === value}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => choose(i)}
                className={cn(
                  'flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm',
                  i === activeIndex ? 'bg-accent/12 text-ink' : 'text-ink-muted',
                )}
              >
                {opt.label}
                {opt.value === value && (
                  <Check className="size-4 text-accent" aria-hidden />
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
