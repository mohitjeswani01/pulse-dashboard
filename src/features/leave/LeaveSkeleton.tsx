import { Skeleton } from '../../components/ui'

/** Mirrors the Leave page layout so nothing shifts when the store hydrates. */
export function LeaveSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="order-2 space-y-6 lg:order-1 lg:col-span-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center rounded-2xl border border-line bg-surface p-5 sm:p-6"
            >
              <div className="flex w-full items-center gap-2.5">
                <Skeleton className="size-10 rounded-xl" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="mt-5 size-[108px] rounded-full" />
              <Skeleton className="mt-4 h-3 w-24" />
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <Skeleton className="h-4 w-32" />
          <div className="mt-5 space-y-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-xl" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-11 w-full rounded-xl" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
