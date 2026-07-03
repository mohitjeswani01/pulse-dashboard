import { useEffect } from 'react'
import { CircleAlert } from 'lucide-react'
import { useLeaveStore } from '../store/leaveStore'
import { PageHeader } from '../components/layout/PageHeader'
import { Button, EmptyState } from '../components/ui'
import { LeaveBalanceRings } from '../features/leave/LeaveBalanceRings'
import { LeaveHistory } from '../features/leave/LeaveHistory'
import { LeaveRequestForm } from '../features/leave/LeaveRequestForm'
import { LeaveSkeleton } from '../features/leave/LeaveSkeleton'

export function LeavePage() {
  const status = useLeaveStore((s) => s.status)
  const hydrate = useLeaveStore((s) => s.hydrate)

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  return (
    <>
      <PageHeader
        title="Leave"
        subtitle="Track your balances and request time off."
      />

      {status === 'error' ? (
        <EmptyState
          icon={CircleAlert}
          title="Couldn't load your leave data"
          description="Something went wrong. Please try again."
          action={
            <Button variant="outline" onClick={() => void hydrate(true)}>
              Try again
            </Button>
          }
        />
      ) : status !== 'ready' ? (
        <LeaveSkeleton />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="order-2 space-y-6 lg:order-1 lg:col-span-2">
            <LeaveBalanceRings />
            <LeaveHistory />
          </div>
          <div className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-6">
              <LeaveRequestForm />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
