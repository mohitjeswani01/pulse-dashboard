import { CalendarClock } from 'lucide-react'
import { useLeaveStore } from '../../store/leaveStore'
import { sortByRecency } from '../../lib/leave'
import { Card, EmptyState } from '../../components/ui'
import { LeaveRequestsTable } from './LeaveRequestsTable'

export function LeaveHistory() {
  const requests = useLeaveStore((s) => s.requests)
  const highlightId = useLeaveStore((s) => s.highlightId)
  const sorted = sortByRecency(requests)

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="font-display text-sm font-black uppercase tracking-tight">
        Leave history
      </h2>
      <div className="mt-4">
        {sorted.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="No leave requests yet"
            description="Requests you submit will show up here with their status."
            className="border-none py-10"
          />
        ) : (
          <LeaveRequestsTable requests={sorted} highlightId={highlightId} />
        )}
      </div>
    </Card>
  )
}
