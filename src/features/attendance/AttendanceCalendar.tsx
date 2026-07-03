import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { AttendanceRecord } from '../../types'
import { cn } from '../../lib/utils'
import { istTodayIso } from '../../lib/attendance'
import { Card } from '../../components/ui'
import { CalendarDay } from './CalendarDay'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const WEEKDAY_HEADERS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

const LEGEND = [
  { label: 'Present', dot: 'bg-positive' },
  { label: 'WFH', dot: 'bg-caution' },
  { label: 'Leave', dot: 'bg-accent' },
  { label: 'Holiday', dot: 'bg-ink-muted' },
  { label: 'Weekend', dot: 'bg-ink-faint' },
]

const navButtonClass =
  'inline-flex size-8 items-center justify-center rounded-lg text-ink-muted transition-colors duration-200 hover:bg-elevated hover:text-ink disabled:pointer-events-none disabled:opacity-35'

interface AttendanceCalendarProps {
  records: AttendanceRecord[]
}

export function AttendanceCalendar({ records }: AttendanceCalendarProps) {
  // Months that actually have data, e.g. ["2026-06", "2026-07"]
  const monthKeys = useMemo(
    () => [...new Set(records.map((r) => r.date.slice(0, 7)))].sort(),
    [records],
  )
  const [monthKey, setMonthKey] = useState(
    () => monthKeys[monthKeys.length - 1] ?? '2026-07',
  )
  const monthIndex = monthKeys.indexOf(monthKey)

  const recordMap = useMemo(
    () => new Map(records.map((r) => [r.date, r])),
    [records],
  )
  const todayIso = istTodayIso()

  const [year, month] = monthKey.split('-').map(Number) as [number, number]
  const daysInMonth = new Date(year, month, 0).getDate()
  const leadingBlanks = (new Date(year, month - 1, 1).getDay() + 6) % 7 // Monday-first

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut', delay: 0.18 }}
    >
      <Card className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-sm font-black uppercase tracking-tight">
            Attendance — {MONTH_NAMES[month - 1]} {year}
          </h3>
          <div className="flex gap-1">
            <button
              type="button"
              className={navButtonClass}
              disabled={monthIndex <= 0}
              onClick={() => setMonthKey(monthKeys[monthIndex - 1] ?? monthKey)}
              aria-label="Previous month"
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              className={navButtonClass}
              disabled={monthIndex >= monthKeys.length - 1}
              onClick={() => setMonthKey(monthKeys[monthIndex + 1] ?? monthKey)}
              aria-label="Next month"
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1.5">
          {WEEKDAY_HEADERS.map((label) => (
            <div
              key={label}
              className="pb-1 text-center text-xs font-medium uppercase tracking-wide text-ink-faint"
            >
              {label}
            </div>
          ))}
          {Array.from({ length: leadingBlanks }, (_, i) => (
            <div key={`blank-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1
            const dateIso = `${monthKey}-${String(day).padStart(2, '0')}`
            return (
              <CalendarDay
                key={dateIso}
                day={day}
                record={recordMap.get(dateIso)}
                isToday={dateIso === todayIso}
                isFuture={dateIso > todayIso}
              />
            )
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-line pt-4">
          {LEGEND.map(({ label, dot }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 text-xs text-ink-muted"
            >
              <span className={cn('size-1.5 rounded-full', dot)} aria-hidden />
              {label}
            </span>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
