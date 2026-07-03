import { motion } from 'framer-motion'
import type { Holiday, LeaveRequest } from '../../types'
import { useLeaveStore } from '../../store/leaveStore'
import { Badge, Card } from '../../components/ui'
import { MONTHS, capitalize } from '../../lib/utils'
import { istTodayIso } from '../../lib/attendance'

interface UpcomingItem {
  date: string
  title: string
  subtitle: string
  status?: 'pending' | 'approved'
}

function buildItems(
  holidays: Holiday[],
  requests: LeaveRequest[],
  todayIso: string,
): UpcomingItem[] {
  const holidayItems: UpcomingItem[] = holidays
    .filter((h) => h.date > todayIso)
    .map((h) => ({ date: h.date, title: h.name, subtitle: 'Company holiday' }))

  const leaveItems: UpcomingItem[] = requests
    .filter((r) => r.from > todayIso && r.status !== 'rejected')
    .map((r) => ({
      date: r.from,
      title: `${capitalize(r.type)} leave`,
      subtitle: r.days === 1 ? '1 day' : `${r.days} days`,
      status: r.status === 'approved' ? 'approved' : 'pending',
    }))

  return [...holidayItems, ...leaveItems]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4)
}

function DateTile({ date }: { date: string }) {
  const [, m, d] = date.split('-').map(Number)
  return (
    <div className="flex w-12 shrink-0 flex-col items-center rounded-xl border border-line bg-elevated py-1.5">
      <span className="text-[10px] font-medium uppercase tracking-wide text-ink-faint">
        {MONTHS[(m ?? 1) - 1]}
      </span>
      <span className="font-display text-lg font-black leading-tight">{d}</span>
    </div>
  )
}

interface UpcomingCardProps {
  holidays: Holiday[]
}

export function UpcomingCard({ holidays }: UpcomingCardProps) {
  const requests = useLeaveStore((s) => s.requests)
  const items = buildItems(holidays, requests, istTodayIso())

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut', delay: 0.3 }}
    >
      <Card className="p-5 sm:p-6">
        <h3 className="font-display text-sm font-black uppercase tracking-tight">
          Upcoming
        </h3>
        {items.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">
            Nothing scheduled — enjoy the routine.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={`${item.date}-${item.title}`} className="flex items-center gap-3">
                <DateTile date={item.date} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-ink-muted">{item.subtitle}</p>
                </div>
                {item.status && (
                  <Badge variant={item.status === 'approved' ? 'success' : 'warning'}>
                    {item.status === 'approved' ? 'Approved' : 'Pending'}
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </motion.div>
  )
}
