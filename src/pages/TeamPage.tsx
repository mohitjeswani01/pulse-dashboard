import { CircleAlert } from 'lucide-react'
import type { Employee } from '../types'
import { getEmployees } from '../services/api'
import { useAsync } from '../lib/useAsync'
import { PageHeader } from '../components/layout/PageHeader'
import { Button, EmptyState } from '../components/ui'
import { useTeamFilter } from '../features/team/useTeamFilter'
import { TeamControls } from '../features/team/TeamControls'
import { TeamGrid } from '../features/team/TeamGrid'
import { TeamSkeleton } from '../features/team/TeamSkeleton'

const NO_MEMBERS: Employee[] = []

export function TeamPage() {
  const { data, loading, error, retry } = useAsync(getEmployees)
  const members = data ?? NO_MEMBERS
  const { query, setQuery, department, setDepartment, counts, filtered, clear } =
    useTeamFilter(members)

  return (
    <>
      <PageHeader
        title="Team"
        subtitle="Everyone at Pulse, across departments and cities."
      />

      {loading ? (
        <TeamSkeleton />
      ) : error || !data ? (
        <EmptyState
          icon={CircleAlert}
          title="Couldn't load the team"
          description="Something went wrong while fetching the directory. Please try again."
          action={
            <Button variant="outline" onClick={retry}>
              Try again
            </Button>
          }
        />
      ) : (
        <>
          <TeamControls
            query={query}
            onQuery={setQuery}
            department={department}
            onDepartment={setDepartment}
            counts={counts}
            shown={filtered.length}
            total={members.length}
          />
          <TeamGrid
            members={filtered}
            query={query}
            department={department}
            onClear={clear}
          />
        </>
      )}
    </>
  )
}
