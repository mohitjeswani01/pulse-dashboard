import { Skeleton } from '../../components/ui'

/** Mirrors the digest card + announcement list so nothing shifts on load. */
export function AnnouncementsSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-28 w-full rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-3 w-20" />
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-line bg-surface p-5 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-8 w-28 rounded-xl" />
            </div>
            <Skeleton className="mt-3 h-5 w-2/3" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
