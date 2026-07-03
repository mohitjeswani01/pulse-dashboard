import { Skeleton } from '../../components/ui'

/** Mirrors the loaded dashboard layout 1:1 so data landing causes no shift. */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Greeting row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <Skeleton className="h-8 w-72 sm:h-9" />
          <Skeleton className="h-4 w-44" />
        </div>
        <Skeleton className="h-7 w-40 rounded-full" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-line bg-surface p-5">
            <Skeleton className="size-10 rounded-xl" />
            <Skeleton className="mt-4 h-3 w-24" />
            <Skeleton className="mt-2 h-8 w-20" />
            <Skeleton className="mt-2 h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Main column + rail */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <div className="flex items-baseline justify-between">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="mt-4 h-64 w-full rounded-xl" />
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-8 w-[4.25rem] rounded-lg" />
            </div>
            <Skeleton className="mt-4 h-[19rem] w-full rounded-xl sm:h-[22rem]" />
            <Skeleton className="mt-4 h-4 w-72" />
          </div>
        </div>

        <div className="min-w-0 space-y-6">
          <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <Skeleton className="h-4 w-32" />
            <div className="mt-4 space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-14" />
                  </div>
                  <Skeleton className="mt-1.5 h-1.5 w-full rounded-full" />
                </div>
              ))}
            </div>
            <Skeleton className="mt-5 h-10 w-full rounded-xl" />
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <Skeleton className="h-4 w-24" />
            <div className="mt-4 space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-[3.25rem] w-12 rounded-xl" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="mt-1.5 h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
