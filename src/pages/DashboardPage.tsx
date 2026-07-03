import { LayoutDashboard } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { EmptyState } from '../components/ui'

export function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Your attendance, leave and week at a glance."
      />
      <EmptyState
        icon={LayoutDashboard}
        title="Dashboard coming soon"
        description="Attendance stats, charts and quick actions will land here."
      />
    </>
  )
}
