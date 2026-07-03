import { motion } from 'framer-motion'
import { Mail, MapPin } from 'lucide-react'
import type { Employee } from '../../types'
import { Badge } from '../../components/ui'
import { Avatar } from './Avatar'

interface MemberCardProps {
  member: Employee
  /** Position in the grid, drives the entrance stagger. */
  index: number
}

export function MemberCard({ member, index }: MemberCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        duration: 0.22,
        ease: 'easeOut',
        delay: Math.min(index, 10) * 0.04,
      }}
      whileHover={{ y: -2 }}
      className="group flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 transition-colors duration-200 hover:border-accent/40"
    >
      <div className="flex items-start gap-3">
        <Avatar name={member.name} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-ink">{member.name}</p>
          <p className="truncate text-sm text-ink-muted">{member.role}</p>
        </div>
        <Badge variant="neutral" className="shrink-0">
          {member.department}
        </Badge>
      </div>

      <div className="space-y-1.5 text-xs text-ink-muted">
        <p className="flex items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0 text-ink-faint" aria-hidden />
          {member.city}
        </p>
        <p className="flex items-center gap-1.5">
          <Mail className="size-3.5 shrink-0 text-ink-faint" aria-hidden />
          <a
            href={`mailto:${member.email}`}
            className="truncate transition-colors hover:text-ink"
          >
            {member.email}
          </a>
        </p>
      </div>
    </motion.article>
  )
}
