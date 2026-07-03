import { CircleAlert, Megaphone, Pin } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Announcement } from '../types'
import { getAnnouncements } from '../services/api'
import { useAsync } from '../lib/useAsync'
import { PageHeader } from '../components/layout/PageHeader'
import { Button, EmptyState } from '../components/ui'
import { DigestCard } from '../features/announcements/DigestCard'
import { AnnouncementCard } from '../features/announcements/AnnouncementCard'
import { AnnouncementsSkeleton } from '../features/announcements/AnnouncementsSkeleton'

const byDateDesc = (a: Announcement, b: Announcement) =>
  b.date.localeCompare(a.date)

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-ink-faint uppercase">
      {children}
    </div>
  )
}

export function AnnouncementsPage() {
  const { data, loading, error, retry } = useAsync(getAnnouncements)

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Announcements"
        subtitle="Company news, policies and events — AI summaries included."
      />

      {loading ? (
        <AnnouncementsSkeleton />
      ) : error || !data ? (
        <EmptyState
          icon={CircleAlert}
          title="Couldn't load announcements"
          description="Something went wrong while fetching the feed. Please try again."
          action={
            <Button variant="outline" onClick={retry}>
              Try again
            </Button>
          }
        />
      ) : data.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="Nothing to announce yet"
          description="Company news and updates will appear here."
        />
      ) : (
        <Feed announcements={data} />
      )}
    </div>
  )
}

function Feed({ announcements }: { announcements: Announcement[] }) {
  const pinned = announcements.filter((a) => a.pinned).sort(byDateDesc)
  const recent = announcements.filter((a) => !a.pinned).sort(byDateDesc)

  return (
    <div className="space-y-8">
      <DigestCard announcements={announcements} />

      {pinned.length > 0 && (
        <section className="space-y-4">
          <SectionLabel>
            <Pin className="size-3.5 text-accent" aria-hidden />
            Pinned
          </SectionLabel>
          {pinned.map((a, i) => (
            <AnnouncementCard key={a.id} announcement={a} index={i} />
          ))}
        </section>
      )}

      {recent.length > 0 && (
        <section className="space-y-4">
          <SectionLabel>Recent</SectionLabel>
          {recent.map((a, i) => (
            <AnnouncementCard
              key={a.id}
              announcement={a}
              index={pinned.length + i}
            />
          ))}
        </section>
      )}
    </div>
  )
}
