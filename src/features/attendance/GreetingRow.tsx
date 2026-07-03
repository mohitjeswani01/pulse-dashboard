import { motion } from 'framer-motion'
import type { AttendanceRecord } from '../../types'
import { cn, formatDateLong } from '../../lib/utils'
import {
  formatTimeLabel,
  greetingFor,
  istHour,
  istTodayIso,
} from '../../lib/attendance'
import { CURRENT_USER_NAME } from '../../lib/constants'

interface TodayChip {
  label: string
  active: boolean
}

function todayChip(record: AttendanceRecord | undefined): TodayChip {
  if (!record) return { label: 'Not checked in', active: false }
  switch (record.status) {
    case 'present':
    case 'wfh': {
      if (record.checkIn && record.checkOut) {
        return {
          label: `Checked out · ${formatTimeLabel(record.checkOut)}`,
          active: false,
        }
      }
      if (record.checkIn) {
        const prefix = record.status === 'wfh' ? 'WFH' : 'Checked in'
        return { label: `${prefix} · ${formatTimeLabel(record.checkIn)}`, active: true }
      }
      return { label: 'Not checked in', active: false }
    }
    case 'leave':
      return { label: 'On leave today', active: false }
    case 'holiday':
      return {
        label: record.note ? `Holiday · ${record.note}` : 'Holiday',
        active: false,
      }
    case 'weekend':
      return { label: 'Weekend', active: false }
    case 'absent':
      return { label: 'Absent today', active: false }
  }
}

interface GreetingRowProps {
  records: AttendanceRecord[]
}

export function GreetingRow({ records }: GreetingRowProps) {
  const todayIso = istTodayIso()
  const chip = todayChip(records.find((r) => r.date === todayIso))
  const firstName = CURRENT_USER_NAME.split(' ')[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="font-display text-2xl font-black uppercase tracking-tight sm:text-3xl">
          {greetingFor(istHour())}, {firstName}
        </h1>
        <p className="text-sm text-ink-muted">{formatDateLong(todayIso)}</p>
      </div>
      <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium">
        <span
          className={cn(
            'size-1.5 rounded-full',
            chip.active ? 'bg-accent' : 'bg-ink-faint',
          )}
          aria-hidden
        />
        {chip.label}
      </span>
    </motion.div>
  )
}
