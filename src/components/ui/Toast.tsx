import { AnimatePresence, motion } from 'framer-motion'
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useToastStore } from '../../store/toastStore'
import type { Toast } from '../../types'
import { cn } from '../../lib/utils'

const variantConfig: Record<
  Toast['variant'],
  { icon: LucideIcon; tileClass: string }
> = {
  success: { icon: CircleCheck, tileClass: 'bg-positive/10 text-positive' },
  error: { icon: CircleAlert, tileClass: 'bg-negative/10 text-negative' },
  info: { icon: Info, tileClass: 'bg-accent/10 text-accent' },
}

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)

  return (
    <div
      className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-[min(20rem,calc(100vw-2rem))] flex-col gap-3 sm:right-6 sm:bottom-6"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const { icon: Icon, tileClass } = variantConfig[toast.variant]
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-line bg-elevated p-4 shadow-lg shadow-black/20"
            >
              <span
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full',
                  tileClass,
                )}
                aria-hidden
              >
                <Icon className="size-4" strokeWidth={2} />
              </span>
              <p className="flex-1 pt-1 text-sm text-ink">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="rounded-lg p-1 text-ink-faint transition-colors duration-200 hover:bg-surface hover:text-ink"
              >
                <X className="size-4" aria-hidden />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
