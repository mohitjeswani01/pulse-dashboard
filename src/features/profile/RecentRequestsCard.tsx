import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarClock } from 'lucide-react'
import { useLeaveStore } from '../../store/leaveStore'
import { sortByRecency } from '../../lib/leave'
import { Card, EmptyState } from '../../components/ui'
import { LeaveRequestsTable } from '../leave/LeaveRequestsTable'

export function RecentRequestsCard() {
  const requests = useLeaveStore((s) => s.requests)
  const recent = sortByRecency(requests).slice(0, 3)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut', delay: 0.18 }}
    >
      <Card className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-sm font-black uppercase tracking-tight">
            My recent requests
          </h2>
          <Link
            to="/leave"
            className="flex items-center gap-1 rounded-lg text-xs font-medium text-ink-muted transition-colors duration-200 hover:text-accent"
          >
            View all
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
        <div className="mt-4">
          {recent.length === 0 ? (
            <EmptyState
              icon={CalendarClock}
              title="No requests yet"
              description="Your latest leave requests will appear here."
              className="border-none py-8"
            />
          ) : (
            <LeaveRequestsTable requests={recent} />
          )}
        </div>
      </Card>
    </motion.div>
  )
}
