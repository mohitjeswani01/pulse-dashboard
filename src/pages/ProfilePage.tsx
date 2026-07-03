import { CircleUser } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { EmptyState } from '../components/ui'

export function ProfilePage() {
  return (
    <>
      <PageHeader
        title="Profile"
        subtitle="Your details, role and preferences."
      />
      <EmptyState
        icon={CircleUser}
        title="Profile coming soon"
        description="Personal details, join date and theme preferences will land here."
      />
    </>
  )
}
