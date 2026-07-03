import type { AttendanceRecord } from '../types'

/** "09:26" → minutes since midnight. */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

/** Minutes since midnight → "9:26 AM". */
export function minutesToTimeLabel(totalMinutes: number): string {
  const total = Math.round(totalMinutes)
  const h24 = Math.floor(total / 60) % 24
  const minutes = total % 60
  const period = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${String(minutes).padStart(2, '0')} ${period}`
}

/** "09:26" → "9:26 AM". */
export function formatTimeLabel(time: string): string {
  return minutesToTimeLabel(timeToMinutes(time))
}

/** Hours worked in a day; null when check-in/out is incomplete. */
export function workedHours(record: AttendanceRecord): number | null {
  if (!record.checkIn || !record.checkOut) return null
  return (timeToMinutes(record.checkOut) - timeToMinutes(record.checkIn)) / 60
}

/** Average check-in (minutes since midnight) across present + WFH days. */
export function avgCheckInMinutes(records: AttendanceRecord[]): number | null {
  const times = records.flatMap((r) =>
    (r.status === 'present' || r.status === 'wfh') && r.checkIn
      ? [timeToMinutes(r.checkIn)]
      : [],
  )
  if (times.length === 0) return null
  return times.reduce((sum, t) => sum + t, 0) / times.length
}

export function countByStatus(
  records: AttendanceRecord[],
  status: AttendanceRecord['status'],
): number {
  return records.filter((r) => r.status === status).length
}

/** Today's ISO date (YYYY-MM-DD) in IST. */
export function istTodayIso(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(
    new Date(),
  )
}

/** Current hour (0–23) in IST. */
export function istHour(): number {
  return Number(
    new Intl.DateTimeFormat('en-GB', {
      hour: 'numeric',
      hourCycle: 'h23',
      timeZone: 'Asia/Kolkata',
    }).format(new Date()),
  )
}

export function greetingFor(hour: number): string {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
