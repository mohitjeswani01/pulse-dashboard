import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

/** Dark-styled text/date input. The orange focus ring comes from the global
 *  :focus-visible rule; here we just warm the border and flag invalid state. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'h-11 w-full rounded-xl border bg-canvas px-3.5 text-sm text-ink',
        'transition-colors duration-200 placeholder:text-ink-faint',
        'focus:border-accent/50',
        invalid
          ? 'border-negative/40'
          : 'border-line hover:border-ink-faint/50',
        className,
      )}
      {...rest}
    />
  )
})
