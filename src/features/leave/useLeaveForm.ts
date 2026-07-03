import { useMemo, useState } from 'react'
import type { RefObject } from 'react'
import type { LeaveBalance, LeaveRequest, LeaveType } from '../../types'
import { useLeaveStore } from '../../store/leaveStore'
import { useToastStore } from '../../store/toastStore'
import { istTodayIso } from '../../lib/attendance'
import {
  LEAVE_TYPE_LABELS,
  dayBreakdown,
  formatDateRange,
  getWorkingDays,
  rangesOverlap,
  remainingOf,
} from '../../lib/leave'

type FieldKey = 'start' | 'end' | 'type' | 'reason' | 'days' | 'overlap'
type Errors = Partial<Record<FieldKey, string>>

interface Values {
  start: string
  end: string
  type: LeaveType | ''
  reason: string
}

const EMPTY: Values = { start: '', end: '', type: '', reason: '' }

function validate(
  v: Values,
  balances: LeaveBalance[],
  requests: LeaveRequest[],
  today: string,
): Errors {
  const errors: Errors = {}

  if (!v.start) errors.start = 'Please pick a start date.'
  else if (v.start < today) errors.start = "Start date can't be in the past."

  if (!v.end) errors.end = 'Please pick an end date.'
  else if (v.start && v.end < v.start)
    errors.end = 'End date must be on or after the start date.'

  if (!v.type) errors.type = 'Please choose a leave type.'

  if (v.reason.trim().length < 10)
    errors.reason = 'Give a reason of at least 10 characters.'

  // Cross-field checks only once the dates form a valid range and type is set.
  const datesValid = v.start && v.end && v.end >= v.start && v.start >= today
  if (datesValid && v.type) {
    const working = getWorkingDays(v.start, v.end)
    const remaining = remainingOf(balances, v.type)
    if (working === 0) {
      errors.days = 'That range has no working days — pick weekdays.'
    } else if (working > remaining) {
      errors.days = `Only ${remaining} ${LEAVE_TYPE_LABELS[v.type]} day${remaining === 1 ? '' : 's'} remaining.`
    }
    const clash = requests.find(
      (r) =>
        r.status !== 'rejected' &&
        rangesOverlap(v.start, v.end, r.from, r.to),
    )
    if (clash) {
      errors.overlap = `Overlaps with your ${clash.status} leave ${formatDateRange(clash.from, clash.to)}.`
    }
  }

  return errors
}

export interface LeaveFieldRefs {
  startRef: RefObject<HTMLInputElement | null>
  endRef: RefObject<HTMLInputElement | null>
  typeRef: RefObject<HTMLButtonElement | null>
  reasonRef: RefObject<HTMLTextAreaElement | null>
}

export function useLeaveForm(refs: LeaveFieldRefs) {
  const balances = useLeaveStore((s) => s.balances)
  const requests = useLeaveStore((s) => s.requests)
  const submit = useLeaveStore((s) => s.submit)
  const pushToast = useToastStore((s) => s.push)
  const today = istTodayIso()

  const [values, setValues] = useState<Values>(EMPTY)
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>(
    {} as Record<FieldKey, boolean>,
  )
  const [attempted, setAttempted] = useState(false)
  const [pending, setPending] = useState(false)

  const errors = useMemo(
    () => validate(values, balances, requests, today),
    [values, balances, requests, today],
  )
  const isValid = Object.keys(errors).length === 0

  const preview = useMemo(() => {
    if (!values.start || !values.end || values.end < values.start) return null
    return dayBreakdown(values.start, values.end)
  }, [values.start, values.end])

  const set = (field: keyof Values, value: string) =>
    setValues((prev) => ({ ...prev, [field]: value }))
  const blur = (field: FieldKey) =>
    setTouched((prev) => ({ ...prev, [field]: true }))

  // A field's error is shown once the user has touched it or tried to submit.
  const showCross = attempted || (touched.start && touched.end && !!values.type)
  const visibleError = (field: FieldKey): string | undefined => {
    if (field === 'days' || field === 'overlap') {
      return showCross ? errors[field] : undefined
    }
    return touched[field] || attempted ? errors[field] : undefined
  }

  const focusFirstError = (errs: Errors) => {
    const order: Array<[FieldKey, HTMLElement | null]> = [
      ['start', refs.startRef.current],
      ['end', refs.endRef.current],
      ['days', refs.endRef.current],
      ['overlap', refs.startRef.current],
      ['type', refs.typeRef.current],
      ['reason', refs.reasonRef.current],
    ]
    order.find(([key, el]) => errs[key] && el)?.[1]?.focus()
  }

  const reset = () => {
    setValues(EMPTY)
    setTouched({} as Record<FieldKey, boolean>)
    setAttempted(false)
  }

  const onSubmit = async () => {
    setAttempted(true)
    if (!isValid) {
      focusFirstError(errors)
      return
    }
    if (!values.type) return // narrow the union for TS
    setPending(true)
    const result = await submit({
      type: values.type,
      from: values.start,
      to: values.end,
      days: getWorkingDays(values.start, values.end),
      reason: values.reason.trim(),
    })
    setPending(false)
    if (result.ok) {
      const days = getWorkingDays(values.start, values.end)
      pushToast(
        `Leave request submitted · ${days} day${days === 1 ? '' : 's'} ${LEAVE_TYPE_LABELS[values.type]}`,
        'success',
      )
      reset()
    } else {
      pushToast("Couldn't submit your request. Please try again.", 'error')
    }
  }

  return {
    values,
    set,
    blur,
    errors,
    visibleError,
    isValid,
    preview,
    pending,
    today,
    onSubmit,
  }
}
