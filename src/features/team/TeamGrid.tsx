import { AnimatePresence } from 'framer-motion'
import { UserX } from 'lucide-react'
import type { Employee } from '../../types'
import { Button, EmptyState } from '../../components/ui'
import { MemberCard } from './MemberCard'
import type { DeptFilter } from './useTeamFilter'

function emptyMessage(query: string, department: DeptFilter): string {
  const q = query.trim()
  if (q && department !== 'all') return `No results for “${q}” in ${department}.`
  if (q) return `No results for “${q}”.`
  if (department !== 'all') return `No members in ${department} right now.`
  return 'Try a different search or filter.'
}

interface TeamGridProps {
  members: Employee[]
  query: string
  department: DeptFilter
  onClear: () => void
}

export function TeamGrid({ members, query, department, onClear }: TeamGridProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {members.map((member, i) => (
            <MemberCard key={member.id} member={member} index={i} />
          ))}
        </AnimatePresence>
      </div>

      {members.length === 0 && (
        <EmptyState
          icon={UserX}
          title="No members found"
          description={emptyMessage(query, department)}
          action={
            <Button variant="ghost" onClick={onClear}>
              Clear filters
            </Button>
          }
        />
      )}
    </>
  )
}
