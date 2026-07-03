import { AnimatePresence, motion } from 'framer-motion'
import { CircleAlert } from 'lucide-react'

interface FieldErrorProps {
  id: string
  message?: string
}

export function FieldError({ id, message }: FieldErrorProps) {
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.p
          id={id}
          key={message}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="mt-1.5 flex items-center gap-1.5 text-xs text-negative"
        >
          <CircleAlert className="size-3.5 shrink-0" aria-hidden />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  )
}
