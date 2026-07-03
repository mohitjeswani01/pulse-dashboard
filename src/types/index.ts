export type Department = 'Engineering' | 'Design' | 'HR' | 'Product'

export interface Employee {
  id: string
  name: string
  role: string
  department: Department
  email: string
  phone: string // "+91 ....."
  city: string
  joinDate: string // ISO date (YYYY-MM-DD)
}

export type AttendanceStatus =
  | 'present'
  | 'absent'
  | 'leave'
  | 'holiday'
  | 'weekend'
  | 'wfh'

export interface AttendanceRecord {
  date: string // ISO date (YYYY-MM-DD)
  status: AttendanceStatus
  checkIn: string | null // "HH:mm" IST
  checkOut: string | null // "HH:mm" IST
  note?: string
}

export type LeaveType = 'casual' | 'sick' | 'earned'

export interface LeaveBalance {
  type: LeaveType
  total: number
  used: number
}

export type LeaveStatus = 'pending' | 'approved' | 'rejected'

export interface LeaveRequest {
  id: string
  type: LeaveType
  from: string // ISO date
  to: string // ISO date
  days: number
  reason: string
  status: LeaveStatus
  appliedOn: string // ISO date
}

export interface Holiday {
  date: string // ISO date (YYYY-MM-DD)
  name: string
}

export type AnnouncementCategory =
  | 'general'
  | 'policy'
  | 'event'
  | 'people'
  | 'facilities'

export interface Announcement {
  id: string
  title: string
  category: AnnouncementCategory
  author: string
  date: string // ISO date
  pinned: boolean
  body: string
}

export interface Toast {
  id: string
  message: string
  variant: 'success' | 'error' | 'info'
}
