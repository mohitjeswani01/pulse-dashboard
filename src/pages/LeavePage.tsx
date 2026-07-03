import { CalendarDays } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { EmptyState } from '../components/ui'

export function LeavePage() {
  return (
    <>
      <PageHeader
        title="Leave"
        subtitle="Apply for time off and track your requests."
      />
      <EmptyState
        icon={CalendarDays}
        title="Leave desk coming soon"
        description="Balances, request history and the apply form will land here."
      />
    </>
  )
}
