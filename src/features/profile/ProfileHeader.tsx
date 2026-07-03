import { motion } from 'framer-motion'
import { Briefcase, Building2, CalendarCheck2, MapPin } from 'lucide-react'
import type { Employee } from '../../types'
import { formatDate } from '../../lib/utils'
import { Avatar } from '../team/Avatar'

interface ProfileHeaderProps {
  employee: Employee
}

export function ProfileHeader({ employee }: ProfileHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="mb-8 flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left"
    >
      <Avatar name={employee.name} className="size-20 rounded-2xl text-2xl" />
      <div className="min-w-0">
        <h1 className="font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
          {employee.name}
        </h1>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-sm text-ink-muted sm:justify-start">
          <span className="flex items-center gap-1.5">
            <Briefcase className="size-4 text-ink-faint" aria-hidden />
            {employee.role}
          </span>
          <span className="flex items-center gap-1.5">
            <Building2 className="size-4 text-ink-faint" aria-hidden />
            {employee.department}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4 text-ink-faint" aria-hidden />
            {employee.city}
          </span>
        </div>
        <div className="mt-3 flex justify-center sm:justify-start">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink-muted">
            <CalendarCheck2 className="size-3.5 text-accent" aria-hidden />
            Joined {formatDate(employee.joinDate)}
          </span>
        </div>
      </div>
    </motion.header>
  )
}
