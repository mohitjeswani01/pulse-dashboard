import { motion } from 'framer-motion'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'
import type { AttendanceRecord } from '../../types'
import {
  avgCheckInMinutes,
  countByStatus,
  minutesToTimeLabel,
  workedHours,
} from '../../lib/attendance'
import { formatDate } from '../../lib/utils'
import { Card } from '../../components/ui'

interface MiniDatum {
  date: string
  day: string
  hours: number
  isWeekend: boolean
}

function toChartData(records: AttendanceRecord[]): MiniDatum[] {
  return records.slice(-14).map((r) => {
    const hours = workedHours(r)
    return {
      date: r.date,
      day: r.date.slice(8),
      hours: hours === null ? 0 : Math.round(hours * 10) / 10,
      isWeekend: r.status === 'weekend',
    }
  })
}

function MiniTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: readonly { payload?: MiniDatum }[]
}) {
  const datum = payload?.[0]?.payload
  if (!active || !datum) return null
  return (
    <div className="rounded-lg border border-line bg-elevated px-2.5 py-1.5 text-xs shadow-lg shadow-black/20">
      <p className="font-medium text-ink">{formatDate(datum.date)}</p>
      <p className="text-ink-muted tabular-nums">
        {datum.hours > 0 ? `${datum.hours.toFixed(1)} hours` : 'No hours'}
      </p>
    </div>
  )
}

interface MiniStat {
  label: string
  value: string
}

interface AttendanceMiniCardProps {
  records: AttendanceRecord[]
}

export function AttendanceMiniCard({ records }: AttendanceMiniCardProps) {
  const data = toChartData(records)
  const avg = avgCheckInMinutes(records)
  const stats: MiniStat[] = [
    { label: 'Present days', value: String(countByStatus(records, 'present')) },
    { label: 'Avg check-in', value: avg === null ? '—' : minutesToTimeLabel(avg) },
  ]
  const range =
    data.length > 0
      ? `${formatDate(data[0].date)} – ${formatDate(data[data.length - 1].date)}`
      : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut', delay: 0.12 }}
    >
      <Card className="flex h-full flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-sm font-black uppercase tracking-tight">
            My attendance
          </h2>
          {range && <p className="text-xs text-ink-faint tabular-nums">{range}</p>}
        </div>

        {/* Gradient in a zero-size sibling SVG — ids resolve document-wide. */}
        <svg width="0" height="0" aria-hidden className="absolute">
          <defs>
            <linearGradient id="miniHoursGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF5C00" />
              <stop offset="100%" stopColor="#FFB800" />
            </linearGradient>
          </defs>
        </svg>
        <div className="mt-4 h-36">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="var(--line)"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'var(--ink-faint)' }}
                interval="preserveStartEnd"
                dy={4}
              />
              <Tooltip content={<MiniTooltip />} cursor={false} />
              <Bar
                dataKey="hours"
                fill="url(#miniHoursGradient)"
                radius={[4, 4, 0, 0]}
                maxBarSize={16}
                isAnimationActive={false}
              >
                {data.map((datum) => (
                  <Cell key={datum.date} fillOpacity={datum.isWeekend ? 0.35 : 1} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-line bg-elevated/50 p-3">
              <p className="text-xs text-ink-faint">{stat.label}</p>
              <p className="mt-0.5 font-display text-xl font-black tabular-nums">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
