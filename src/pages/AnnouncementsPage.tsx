import { Megaphone } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { EmptyState } from '../components/ui'

export function AnnouncementsPage() {
  return (
    <>
      <PageHeader
        title="Announcements"
        subtitle="Company news, policies and events — AI summaries included."
      />
      <EmptyState
        icon={Megaphone}
        title="Announcements coming soon"
        description="Pinned notices, categories and AI-powered TL;DRs will land here."
      />
    </>
  )
}
