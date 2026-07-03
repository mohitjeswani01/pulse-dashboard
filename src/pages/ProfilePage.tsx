import { useEffect } from 'react'
import { CircleAlert } from 'lucide-react'
import type { Employee } from '../types'
import { getAttendance, getEmployees } from '../services/api'
import { useAsync } from '../lib/useAsync'
import { useLeaveStore } from '../store/leaveStore'
import { CURRENT_USER_NAME } from '../lib/constants'
import { Button, EmptyState } from '../components/ui'
import { ProfileHeader } from '../features/profile/ProfileHeader'
import { DetailsCard } from '../features/profile/DetailsCard'
import { AttendanceMiniCard } from '../features/profile/AttendanceMiniCard'
import { RecentRequestsCard } from '../features/profile/RecentRequestsCard'
import { ProfileSkeleton } from '../features/profile/ProfileSkeleton'

// Module-level so the reference stays stable across renders (useAsync dep).
async function loadProfile() {
  const [employees, attendance] = await Promise.all([
    getEmployees(),
    getAttendance(),
  ])
  return { employees, attendance }
}

/** The current user's manager: a manager/lead in the same department. */
function findManager(employees: Employee[], user: Employee): string {
  const manager = employees.find(
    (e) =>
      e.id !== user.id &&
      e.department === user.department &&
      /manager|lead|head/i.test(e.role),
  )
  return manager?.name ?? '—'
}

export function ProfilePage() {
  const { data, loading, error, retry } = useAsync(loadProfile)
  const leaveStatus = useLeaveStore((s) => s.status)
  const hydrateLeave = useLeaveStore((s) => s.hydrate)

  useEffect(() => {
    void hydrateLeave()
  }, [hydrateLeave])

  const leaveLoading = leaveStatus === 'idle' || leaveStatus === 'loading'

  if (loading || leaveLoading) return <ProfileSkeleton />

  if (error || leaveStatus === 'error' || !data) {
    return (
      <EmptyState
        icon={CircleAlert}
        title="Couldn't load your profile"
        description="Something went wrong while fetching your details. Please try again."
        action={
          <Button
            variant="outline"
            onClick={() => {
              retry()
              void hydrateLeave(true)
            }}
          >
            Try again
          </Button>
        }
      />
    )
  }

  const user =
    data.employees.find((e) => e.name === CURRENT_USER_NAME) ?? data.employees[0]

  if (!user) {
    return (
      <EmptyState
        icon={CircleAlert}
        title="Profile unavailable"
        description="We couldn't find your employee record."
      />
    )
  }

  return (
    <div>
      <ProfileHeader employee={user} />
      <div className="grid gap-6 lg:grid-cols-2">
        <DetailsCard employee={user} managerName={findManager(data.employees, user)} />
        <AttendanceMiniCard records={data.attendance} />
      </div>
      <div className="mt-6">
        <RecentRequestsCard />
      </div>
    </div>
  )
}
