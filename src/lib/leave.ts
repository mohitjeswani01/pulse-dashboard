import type { LeaveBalance, LeaveRequest, LeaveType } from '../types'
import { MONTHS, capitalize, formatDate } from './utils'

export const LEAVE_TYPES: LeaveType[] = ['casual', 'sick', 'earned']

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  casual: 'Casual',
  sick: 'Sick',
  earned: 'Earned',
}

interface DayBreakdown {
  total: number
  working: number
  weekend: number
}

/**
 * Count working (Mon–Fri) days between two ISO dates, inclusive.
 * Returns 0 for an invalid or reversed range.
 */
export function getWorkingDays(fromIso: string, toIso: string): number {
  return dayBreakdown(fromIso, toIso).working
}

/** Split an inclusive ISO date range into total / working / weekend day counts. */
export function dayBreakdown(fromIso: string, toIso: string): DayBreakdown {
  const from = new Date(`${fromIso}T00:00:00`)
  const to = new Date(`${toIso}T00:00:00`)
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from > to) {
    return { total: 0, working: 0, weekend: 0 }
  }
  let working = 0
  let weekend = 0
  const cursor = new Date(from)
  while (cursor <= to) {
    const day = cursor.getDay()
    if (day === 0 || day === 6) weekend++
    else working++
    cursor.setDate(cursor.getDate() + 1)
  }
  return { total: working + weekend, working, weekend }
}

/**
 * Format an inclusive date range compactly:
 * same day → "12 Aug 2026", same month → "12–14 Aug 2026",
 * same year → "28 Jul – 3 Aug 2026", else "30 Dec 2026 – 2 Jan 2027".
 */
export function formatDateRange(fromIso: string, toIso: string): string {
  if (fromIso === toIso) return formatDate(fromIso)
  const [fy, fm, fd] = fromIso.split('-').map(Number)
  const [ty, tm, td] = toIso.split('-').map(Number)
  if (!fy || !fm || !fd || !ty || !tm || !td) return `${fromIso} – ${toIso}`
  const pad = (n: number) => String(n).padStart(2, '0')
  if (fy === ty && fm === tm) {
    return `${pad(fd)}–${pad(td)} ${MONTHS[fm - 1]} ${fy}`
  }
  if (fy === ty) {
    return `${pad(fd)} ${MONTHS[fm - 1]} – ${pad(td)} ${MONTHS[tm - 1]} ${fy}`
  }
  return `${formatDate(fromIso)} – ${formatDate(toIso)}`
}

/** Do two inclusive ISO date ranges share any day? */
export function rangesOverlap(
  aFrom: string,
  aTo: string,
  bFrom: string,
  bTo: string,
): boolean {
  return aFrom <= bTo && aTo >= bFrom
}

/** Remaining days for a leave type, given the current balances. */
export function remainingOf(
  balances: LeaveBalance[],
  type: LeaveType,
): number {
  const balance = balances.find((b) => b.type === type)
  return balance ? balance.total - balance.used : 0
}

/** Human label for a leave request, e.g. "Casual leave". */
export function leaveTypeLabel(type: LeaveType): string {
  return `${capitalize(type)} leave`
}

/** Most-recent-first: by applied date, tie-broken by start date. */
export function sortByRecency(requests: LeaveRequest[]): LeaveRequest[] {
  return [...requests].sort(
    (a, b) => b.appliedOn.localeCompare(a.appliedOn) || b.from.localeCompare(a.from),
  )
}
