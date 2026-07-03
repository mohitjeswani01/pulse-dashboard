import type {
  Announcement,
  AttendanceRecord,
  Employee,
  LeaveBalance,
  LeaveRequest,
} from '../types'
import employeesData from '../data/employees.json'
import attendanceData from '../data/attendance.json'
import leaveBalancesData from '../data/leaveBalances.json'
import leaveRequestsData from '../data/leaveRequests.json'
import announcementsData from '../data/announcements.json'

/** Simulate network latency: 400–800ms. */
function delay(): Promise<void> {
  const ms = 400 + Math.random() * 400
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const employees = employeesData as Employee[]
const attendance = attendanceData as AttendanceRecord[]
const announcements = announcementsData as Announcement[]

const leaveBalances = leaveBalancesData as LeaveBalance[]

// Mutable session state so submitted requests show up in subsequent fetches.
let leaveRequests = leaveRequestsData as LeaveRequest[]

export async function getEmployees(): Promise<Employee[]> {
  await delay()
  return [...employees]
}

export async function getAttendance(): Promise<AttendanceRecord[]> {
  await delay()
  return [...attendance]
}

export async function getLeaveBalances(): Promise<LeaveBalance[]> {
  await delay()
  return leaveBalances.map((balance) => ({ ...balance }))
}

export async function getLeaveRequests(): Promise<LeaveRequest[]> {
  await delay()
  return [...leaveRequests]
}

export async function getAnnouncements(): Promise<Announcement[]> {
  await delay()
  return [...announcements]
}

export type NewLeaveRequest = Omit<LeaveRequest, 'id' | 'status' | 'appliedOn'>

export async function submitLeaveRequest(
  input: NewLeaveRequest,
): Promise<LeaveRequest> {
  await delay()
  const request: LeaveRequest = {
    ...input,
    id: `lr-${String(leaveRequests.length + 1).padStart(3, '0')}`,
    status: 'pending',
    appliedOn: new Date().toISOString().slice(0, 10),
  }
  leaveRequests = [request, ...leaveRequests]
  return request
}
