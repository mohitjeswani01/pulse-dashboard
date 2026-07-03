import { Users } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { EmptyState } from '../components/ui'

export function TeamPage() {
  return (
    <>
      <PageHeader
        title="Team"
        subtitle="Everyone at Pulse, across departments and cities."
      />
      <EmptyState
        icon={Users}
        title="Team directory coming soon"
        description="Browse and search all twelve of us — filters included."
      />
    </>
  )
}
