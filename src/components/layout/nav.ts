import {
  CalendarDays,
  CircleUser,
  LayoutDashboard,
  Megaphone,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leave', label: 'Leave', icon: CalendarDays },
  { to: '/team', label: 'Team', icon: Users },
  { to: '/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/profile', label: 'Profile', icon: CircleUser },
]

export const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/leave': 'Leave',
  '/team': 'Team',
  '/announcements': 'Announcements',
  '/profile': 'Profile',
}
