import { motion } from 'framer-motion'
import type { LeaveRequest } from '../../types'
import { LEAVE_TYPE_LABELS, formatDateRange } from '../../lib/leave'
import { LeaveStatusBadge } from './LeaveStatusBadge'

const HIGHLIGHT = { backgroundColor: 'rgba(255,92,0,0.16)' }
const CLEAR = { backgroundColor: 'rgba(255,92,0,0)' }
const flash = (isNew: boolean) =>
  isNew
    ? {
        initial: HIGHLIGHT,
        animate: CLEAR,
        transition: { duration: 1.5, ease: 'easeOut' as const },
      }
    : {}

const COLUMNS = ['Type', 'Dates', 'Days', 'Reason', 'Status']

interface LeaveRequestsTableProps {
  requests: LeaveRequest[]
  highlightId?: string | null
}

/** Presentational requests table — desktop table, mobile stacked cards.
 *  Reused by the Leave page history and the Profile "recent requests" card. */
export function LeaveRequestsTable({
  requests,
  highlightId = null,
}: LeaveRequestsTableProps) {
  return (
    <>
      <table className="hidden w-full border-collapse text-sm md:table">
        <thead>
          <tr className="text-left">
            {COLUMNS.map((col) => (
              <th
                key={col}
                className="px-3 pb-3 text-xs font-medium uppercase tracking-wide text-ink-faint"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <motion.tr
              key={r.id}
              {...flash(r.id === highlightId)}
              className="border-t border-line transition-colors hover:bg-elevated"
            >
              <td className="px-3 py-3.5 font-medium">
                {LEAVE_TYPE_LABELS[r.type]}
              </td>
              <td className="px-3 py-3.5 tabular-nums text-ink-muted">
                {formatDateRange(r.from, r.to)}
              </td>
              <td className="px-3 py-3.5 tabular-nums text-ink-muted">{r.days}</td>
              <td
                className="max-w-[15rem] truncate px-3 py-3.5 text-ink-muted"
                title={r.reason}
              >
                {r.reason}
              </td>
              <td className="px-3 py-3.5">
                <LeaveStatusBadge status={r.status} />
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      <ul className="space-y-3 md:hidden">
        {requests.map((r) => (
          <motion.li
            key={r.id}
            {...flash(r.id === highlightId)}
            className="rounded-xl border border-line p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{LEAVE_TYPE_LABELS[r.type]}</span>
              <LeaveStatusBadge status={r.status} />
            </div>
            <p className="mt-2 text-sm text-ink-muted tabular-nums">
              {formatDateRange(r.from, r.to)}
              <span className="text-ink-faint">
                {' · '}
                {r.days} day{r.days === 1 ? '' : 's'}
              </span>
            </p>
            <p className="mt-1 text-sm text-ink-faint">{r.reason}</p>
          </motion.li>
        ))}
      </ul>
    </>
  )
}
