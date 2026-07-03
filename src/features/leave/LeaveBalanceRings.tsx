import { motion } from 'framer-motion'
import { Coffee, HeartPulse, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { LeaveType } from '../../types'
import { useLeaveStore } from '../../store/leaveStore'
import { LEAVE_TYPE_LABELS } from '../../lib/leave'
import { Card, IconTile } from '../../components/ui'
import { RadialProgress } from './RadialProgress'

const ICONS: Record<LeaveType, LucideIcon> = {
  casual: Coffee,
  sick: HeartPulse,
  earned: Wallet,
}

export function LeaveBalanceRings() {
  const balances = useLeaveStore((s) => s.balances)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {balances.map((balance, i) => {
        const remaining = balance.total - balance.used
        return (
          <motion.div
            key={balance.type}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut', delay: i * 0.06 }}
          >
            <Card hover className="flex flex-col items-center p-5 text-center sm:p-6">
              <div className="flex w-full items-center gap-2.5">
                <IconTile icon={ICONS[balance.type]} />
                <span className="font-display text-sm font-black uppercase tracking-tight">
                  {LEAVE_TYPE_LABELS[balance.type]}
                </span>
              </div>
              <div className="mt-5">
                <RadialProgress
                  fraction={balance.total ? remaining / balance.total : 0}
                >
                  <span className="font-display text-3xl font-black leading-none tabular-nums">
                    {remaining}
                  </span>
                  <span className="mt-1 text-[11px] text-ink-faint">
                    of {balance.total}
                  </span>
                </RadialProgress>
              </div>
              <p className="mt-4 text-xs text-ink-muted">
                {balance.used} used this year
              </p>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
