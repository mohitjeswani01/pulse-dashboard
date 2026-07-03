import { SearchInput, FilterChips } from '../../components/ui'
import type { FilterChip } from '../../components/ui'
import { DEPARTMENTS } from './useTeamFilter'
import type { DeptFilter } from './useTeamFilter'

interface TeamControlsProps {
  query: string
  onQuery: (value: string) => void
  department: DeptFilter
  onDepartment: (value: DeptFilter) => void
  counts: Record<DeptFilter, number>
  shown: number
  total: number
}

/** Sticky filter bar: search + result count + department chips. */
export function TeamControls({
  query,
  onQuery,
  department,
  onDepartment,
  counts,
  shown,
  total,
}: TeamControlsProps) {
  const chips: FilterChip[] = [
    { value: 'all', label: 'All', count: counts.all },
    ...DEPARTMENTS.map((d) => ({ value: d, label: d, count: counts[d] })),
  ]

  return (
    <div className="sticky top-16 z-20 -mx-4 mb-6 bg-canvas/95 px-4 pt-2 pb-4 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SearchInput
            className="w-full max-w-md"
            label="Search team members"
            placeholder="Search by name or role…"
            value={query}
            onChange={onQuery}
          />
          <p
            role="status"
            aria-live="polite"
            className="text-sm text-ink-muted tabular-nums"
          >
            Showing {shown} of {total} members
          </p>
        </div>
        <FilterChips
          label="Filter by department"
          chips={chips}
          value={department}
          onChange={(v) => onDepartment(v as DeptFilter)}
        />
      </div>
    </div>
  )
}
