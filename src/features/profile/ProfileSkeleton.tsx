import { Skeleton } from '../../components/ui'

/** Mirrors the Profile layout so nothing shifts when data lands. */
export function ProfileSkeleton() {
  return (
    <div>
      <div className="mb-8 flex flex-col items-center gap-5 sm:flex-row">
        <Skeleton className="size-20 rounded-2xl" />
        <div className="w-full space-y-2.5">
          <Skeleton className="mx-auto h-9 w-64 sm:mx-0" />
          <Skeleton className="mx-auto h-4 w-72 sm:mx-0" />
          <Skeleton className="mx-auto h-6 w-40 rounded-full sm:mx-0" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-line bg-surface p-5 sm:p-6"
          >
            <Skeleton className="h-4 w-28" />
            <div className="mt-5 space-y-4">
              {[0, 1, 2].map((j) => (
                <Skeleton key={j} className="h-8 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <Skeleton className="h-4 w-40" />
        <div className="mt-5 space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
