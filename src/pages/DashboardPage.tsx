import {
  CalendarCheck,
  CalendarX,
  CircleAlert,
  Clock,
  Laptop,
  TreePalm,
} from 'lucide-react'
import {
  getAttendance,
  getHolidays,
  getLeaveBalances,
  getLeaveRequests,
} from '../services/api'
import { useAsync } from '../lib/useAsync'
import {
  avgCheckInMinutes,
  countByStatus,
  minutesToTimeLabel,
} from '../lib/attendance'
import { formatDate } from '../lib/utils'
import { Button, EmptyState, StatCard } from '../components/ui'
import { GreetingRow } from '../features/attendance/GreetingRow'
import { HoursChart } from '../features/attendance/HoursChart'
import { AttendanceCalendar } from '../features/attendance/AttendanceCalendar'
import { UpcomingCard } from '../features/attendance/UpcomingCard'
import { DashboardSkeleton } from '../features/attendance/DashboardSkeleton'
import { LeaveBalanceCard } from '../features/leave/LeaveBalanceCard'

// Module-level so the reference stays stable across renders (useAsync dep)
async function loadDashboard() {
  const [attendance, balances, requests, holidays] = await Promise.all([
    getAttendance(),
    getLeaveBalances(),
    getLeaveRequests(),
    getHolidays(),
  ])
  return { attendance, balances, requests, holidays }
}

export function DashboardPage() {
  const { data, loading, error, retry } = useAsync(loadDashboard)

  if (loading) return <DashboardSkeleton />

  if (error || !data) {
    return (
      <EmptyState
        icon={CircleAlert}
        title="Couldn't load your dashboard"
        description="Something went wrong while fetching your data. Please try again."
        action={
          <Button variant="outline" onClick={retry}>
            Try again
          </Button>
        }
      />
    )
  }

  const { attendance, balances, requests, holidays } = data

  if (attendance.length === 0) {
    return (
      <EmptyState
        icon={CalendarX}
        title="No attendance yet"
        description="Once you start checking in, your stats and calendar will appear here."
      />
    )
  }

  const avgCheckIn = avgCheckInMinutes(attendance)
  const since = `since ${formatDate(attendance[0].date).slice(0, 6)}`

  return (
    <div className="space-y-6">
      <GreetingRow records={attendance} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          index={0}
          icon={CalendarCheck}
          label="Present days"
          value={countByStatus(attendance, 'present')}
          subtext={since}
        />
        <StatCard
          index={1}
          icon={Clock}
          label="Avg check-in"
          value={avgCheckIn ?? 0}
          format={minutesToTimeLabel}
          subtext="present & WFH days"
        />
        <StatCard
          index={2}
          icon={Laptop}
          label="WFH days"
          value={countByStatus(attendance, 'wfh')}
          subtext={since}
        />
        <StatCard
          index={3}
          icon={TreePalm}
          label="Leaves taken"
          value={countByStatus(attendance, 'leave')}
          subtext={since}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <HoursChart records={attendance} />
          <AttendanceCalendar records={attendance} />
        </div>
        <div className="min-w-0 space-y-6">
          <LeaveBalanceCard balances={balances} />
          <UpcomingCard holidays={holidays} requests={requests} />
        </div>
      </div>
    </div>
  )
}
