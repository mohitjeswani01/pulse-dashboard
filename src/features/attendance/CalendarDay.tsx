import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { AttendanceRecord, AttendanceStatus } from '../../types'
import { cn } from '../../lib/utils'
import { formatTimeLabel } from '../../lib/attendance'

const DAY_STYLES: Record<
  AttendanceStatus,
  { cell: string; dot: string | null; label: string }
> = {
  present: { cell: 'bg-positive/10', dot: 'bg-positive', label: 'Present' },
  wfh: { cell: 'bg-caution/10', dot: 'bg-caution', label: 'WFH' },
  leave: { cell: 'bg-accent/10', dot: 'bg-accent', label: 'Leave' },
  holiday: { cell: 'bg-elevated', dot: null, label: 'Holiday' },
  absent: { cell: 'bg-negative/10', dot: 'bg-negative', label: 'Absent' },
  weekend: { cell: 'text-ink-faint', dot: null, label: 'Weekend' },
}

interface CalendarDayProps {
  day: number
  record: AttendanceRecord | undefined
  isToday: boolean
  isFuture: boolean
}

export function CalendarDay({ day, record, isToday, isFuture }: CalendarDayProps) {
  const [showTip, setShowTip] = useState(false)

  if (isFuture || !record) {
    return (
      <div
        className={cn(
          'flex h-12 items-center justify-center rounded-lg text-xs text-ink-faint sm:h-14',
          isToday && 'ring-1 ring-accent',
        )}
      >
        {day}
      </div>
    )
  }

  const style = DAY_STYLES[record.status]
  const times =
    record.checkIn && record.checkOut
      ? `${formatTimeLabel(record.checkIn)} – ${formatTimeLabel(record.checkOut)}`
      : record.checkIn
        ? `In ${formatTimeLabel(record.checkIn)}`
        : null

  return (
    <div className="relative">
      <button
        type="button"
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        onFocus={() => setShowTip(true)}
        onBlur={() => setShowTip(false)}
        aria-label={`${day}: ${style.label}${times ? `, ${times}` : ''}`}
        className={cn(
          'flex h-12 w-full flex-col items-center justify-center gap-0.5 rounded-lg text-xs font-medium sm:h-14',
          style.cell,
          isToday && 'ring-1 ring-accent',
        )}
      >
        {day}
        {style.dot && (
          <span className={cn('size-1 rounded-full', style.dot)} aria-hidden />
        )}
        {record.status === 'holiday' && (
          <span className="max-w-full truncate px-1 text-[8px] uppercase tracking-wide text-ink-faint">
            {record.note ?? 'Holiday'}
          </span>
        )}
      </button>

      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: 4, x: '-50%', scale: 0.96 }}
            animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
            exit={{ opacity: 0, y: 4, x: '-50%', scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            role="tooltip"
            className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 whitespace-nowrap rounded-lg border border-line bg-elevated px-2.5 py-1.5 text-xs shadow-lg shadow-black/20"
          >
            <p className="font-medium text-ink">{style.label}</p>
            {times && <p className="mt-0.5 text-ink-muted">{times}</p>}
            {record.note && record.status !== 'holiday' && (
              <p className="mt-0.5 text-ink-faint">{record.note}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
