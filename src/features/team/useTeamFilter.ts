import { useMemo, useState } from 'react'
import type { Department, Employee } from '../../types'
import { useDebounce } from '../../lib/useDebounce'

export type DeptFilter = Department | 'all'

export const DEPARTMENTS: Department[] = [
  'Engineering',
  'Design',
  'Product',
  'HR',
]

/**
 * Page-scoped directory filtering: debounced case-insensitive match on name OR
 * role, AND-combined with the department chip. All derived values memoized.
 */
export function useTeamFilter(members: Employee[]) {
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState<DeptFilter>('all')
  const debouncedQuery = useDebounce(query, 300)

  const counts = useMemo(() => {
    const map: Record<DeptFilter, number> = {
      all: members.length,
      Engineering: 0,
      Design: 0,
      Product: 0,
      HR: 0,
    }
    for (const m of members) map[m.department] += 1
    return map
  }, [members])

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    return members.filter((m) => {
      const matchesDept = department === 'all' || m.department === department
      const matchesQuery =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q)
      return matchesDept && matchesQuery
    })
  }, [members, debouncedQuery, department])

  const clear = () => {
    setQuery('')
    setDepartment('all')
  }

  return {
    query,
    setQuery,
    department,
    setDepartment,
    counts,
    filtered,
    clear,
  }
}
