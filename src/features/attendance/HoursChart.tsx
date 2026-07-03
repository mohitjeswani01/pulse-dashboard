import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { motion } from 'framer-motion'
import type { AttendanceRecord } from '../../types'
import { formatTimeLabel, workedHours } from '../../lib/attendance'
import { formatDate } from '../../lib/utils'
import { Card } from '../../components/ui'

interface HoursDatum {
  date: string
  day: string
  hours: number
  isWeekend: boolean
  inProgress: boolean
  checkIn: string | null
}

function toChartData(records: AttendanceRecord[]): HoursDatum[] {
  return records.slice(-14).map((r) => {
    const hours = workedHours(r)
    return {
      date: r.date,
      day: r.date.slice(8),
      hours: hours === null ? 0 : Math.round(hours * 10) / 10,
      isWeekend: r.status === 'weekend',
      inProgress: Boolean(r.checkIn && !r.checkOut),
      checkIn: r.checkIn,
    }
  })
}

interface TooltipEntry {
  payload?: HoursDatum
}

function HoursTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: readonly TooltipEntry[]
}) {
  const datum = payload?.[0]?.payload
  if (!active || !datum) return null
  return (
    <div className="rounded-xl border border-line bg-elevated px-3 py-2 shadow-lg shadow-black/20">
      <p className="text-xs font-medium text-ink">{formatDate(datum.date)}</p>
      <p className="mt-0.5 text-xs text-ink-muted">
        {datum.inProgress && datum.checkIn
          ? `In ${formatTimeLabel(datum.checkIn)} · in progress`
          : datum.hours > 0
            ? `${datum.hours.toFixed(1)} hours`
            : 'No working hours'}
      </p>
    </div>
  )
}

interface HoursChartProps {
  records: AttendanceRecord[]
}

export function HoursChart({ records }: HoursChartProps) {
  const [activeBar, setActiveBar] = useState<number | null>(null)
  const data = toChartData(records)
  const first = data[0]
  const last = data[data.length - 1]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut', delay: 0.12 }}
    >
      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-display text-sm font-black uppercase tracking-tight">
            Working hours
          </h3>
          {first && last && (
            <p className="text-xs text-ink-faint">
              {formatDate(first.date)} – {formatDate(last.date)}
            </p>
          )}
        </div>
        {/* Chromium fails to repaint gradient-filled bars after recharts'
            entrance animation mutates them (stale paint invalidation), so the
            gradient lives in a zero-size sibling SVG (ids resolve
            document-wide) and the Bar's own animation stays disabled — the
            card-level fade-up provides the entrance instead. */}
        <svg width="0" height="0" aria-hidden className="absolute">
          <defs>
            <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF5C00" />
              <stop offset="100%" stopColor="#FFB800" />
            </linearGradient>
          </defs>
        </svg>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 0, left: -18, bottom: 0 }}
              onMouseLeave={() => setActiveBar(null)}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="var(--line)"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'var(--ink-faint)' }}
                dy={6}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'var(--ink-faint)' }}
                tickFormatter={(value: number) => `${value}h`}
              />
              <Tooltip content={<HoursTooltip />} cursor={false} />
              <Bar
                dataKey="hours"
                fill="url(#hoursGradient)"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
                isAnimationActive={false}
              >
                {data.map((datum, i) => (
                  <Cell
                    key={datum.date}
                    fillOpacity={
                      activeBar === null
                        ? datum.isWeekend
                          ? 0.35
                          : 1
                        : activeBar === i
                          ? 1
                          : 0.4
                    }
                    onMouseEnter={() => setActiveBar(i)}
                    style={{ transition: 'fill-opacity 200ms ease-out' }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  )
}
