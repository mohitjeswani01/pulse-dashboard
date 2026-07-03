import { forwardRef, useRef } from 'react'
import type { Ref } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, CalendarRange, SendHorizonal } from 'lucide-react'
import { LEAVE_TYPES, LEAVE_TYPE_LABELS } from '../../lib/leave'
import { Button, Card, IconTile, Input, Select, Textarea } from '../../components/ui'
import type { SelectOption } from '../../components/ui'
import { useLeaveForm } from './useLeaveForm'
import { FieldError } from './FieldError'

const TYPE_OPTIONS: SelectOption[] = LEAVE_TYPES.map((t) => ({
  value: t,
  label: LEAVE_TYPE_LABELS[t],
}))

/** Native date field with an overlaid Calendar icon (see .date-input CSS). */
const DateField = forwardRef(function DateField(
  props: {
    id: string
    label: string
    value: string
    min: string
    invalid: boolean
    errorId: string
    onChange: (v: string) => void
    onBlur: () => void
  },
  ref: Ref<HTMLInputElement>,
) {
  return (
    <div>
      <label htmlFor={props.id} className="text-xs font-medium text-ink-muted">
        {props.label}
      </label>
      <div className="relative mt-1.5">
        <Input
          ref={ref}
          id={props.id}
          type="date"
          className="date-input pr-10"
          value={props.value}
          min={props.min}
          invalid={props.invalid}
          aria-describedby={props.invalid ? props.errorId : undefined}
          onChange={(e) => props.onChange(e.target.value)}
          onBlur={props.onBlur}
        />
        <CalendarDays
          className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-ink-muted"
          aria-hidden
        />
      </div>
    </div>
  )
})

export function LeaveRequestForm() {
  const startRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLInputElement>(null)
  const typeRef = useRef<HTMLButtonElement>(null)
  const reasonRef = useRef<HTMLTextAreaElement>(null)
  const f = useLeaveForm({ startRef, endRef, typeRef, reasonRef })
  const { values } = f
  const startErr = f.visibleError('start')
  const endErr = f.visibleError('end')
  const typeErr = f.visibleError('type')
  const reasonErr = f.visibleError('reason')
  const daysErr = f.visibleError('days')
  const overlapErr = f.visibleError('overlap')

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <IconTile icon={CalendarRange} />
        <div>
          <h2 className="font-display text-sm font-black uppercase tracking-tight">
            Request leave
          </h2>
          <p className="text-xs text-ink-muted">Fill in the details below.</p>
        </div>
      </div>

      <form
        className="mt-5 space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          void f.onSubmit()
        }}
        noValidate
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <DateField
              ref={startRef}
              id="leave-start"
              label="Start date"
              value={values.start}
              min={f.today}
              invalid={Boolean(startErr)}
              errorId="leave-start-error"
              onChange={(v) => f.set('start', v)}
              onBlur={() => f.blur('start')}
            />
            <FieldError id="leave-start-error" message={startErr} />
          </div>
          <div>
            <DateField
              ref={endRef}
              id="leave-end"
              label="End date"
              value={values.end}
              min={values.start || f.today}
              invalid={Boolean(endErr)}
              errorId="leave-end-error"
              onChange={(v) => f.set('end', v)}
              onBlur={() => f.blur('end')}
            />
            <FieldError id="leave-end-error" message={endErr} />
          </div>
        </div>

        <AnimatePresence>
          {f.preview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 rounded-xl border border-accent/20 bg-accent/10 px-3.5 py-2.5 text-xs">
                <CalendarRange className="size-4 shrink-0 text-accent" aria-hidden />
                <span>
                  <span className="font-semibold text-ink">
                    {f.preview.working} working day
                    {f.preview.working === 1 ? '' : 's'}
                  </span>
                  {f.preview.weekend > 0 && (
                    <span className="text-ink-muted">
                      {' · '}
                      {f.preview.weekend} weekend day
                      {f.preview.weekend === 1 ? '' : 's'} excluded
                    </span>
                  )}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <FieldError id="leave-days-error" message={daysErr} />
        <FieldError id="leave-overlap-error" message={overlapErr} />

        <div>
          <label
            id="leave-type-label"
            htmlFor="leave-type"
            className="text-xs font-medium text-ink-muted"
          >
            Leave type
          </label>
          <div className="mt-1.5">
            <Select
              id="leave-type"
              buttonRef={typeRef}
              value={values.type}
              options={TYPE_OPTIONS}
              placeholder="Select a type"
              invalid={Boolean(typeErr)}
              describedBy={typeErr ? 'leave-type-error' : undefined}
              onChange={(v) => {
                f.set('type', v)
                f.blur('type')
              }}
            />
          </div>
          <FieldError id="leave-type-error" message={typeErr} />
        </div>

        <div>
          <label
            htmlFor="leave-reason"
            className="text-xs font-medium text-ink-muted"
          >
            Reason
          </label>
          <div className="relative mt-1.5">
            <Textarea
              ref={reasonRef}
              id="leave-reason"
              rows={3}
              maxLength={200}
              value={values.reason}
              invalid={Boolean(reasonErr)}
              placeholder="Briefly, why are you taking this leave?"
              aria-describedby={reasonErr ? 'leave-reason-error' : undefined}
              onChange={(e) => f.set('reason', e.target.value)}
              onBlur={() => f.blur('reason')}
            />
            <span className="pointer-events-none absolute right-3 bottom-2.5 text-[11px] text-ink-faint tabular-nums">
              {values.reason.length}/200
            </span>
          </div>
          <FieldError id="leave-reason-error" message={reasonErr} />
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={f.pending}
          disabled={!f.isValid}
        >
          {!f.pending && <SendHorizonal className="size-4" aria-hidden />}
          Submit request
        </Button>
      </form>
    </Card>
  )
}
