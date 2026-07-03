import { forwardRef } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ invalid, className, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          'w-full resize-none rounded-xl border bg-canvas px-3.5 py-2.5 text-sm text-ink',
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
  },
)
