import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useLeaveStore } from '../../store/leaveStore'
import { LEAVE_TYPE_LABELS } from '../../lib/leave'
import { Button, Card } from '../../components/ui'

/** Dashboard rail card — reads balances from the shared leaveStore, so a
 *  request submitted on the Leave page updates these bars live too. */
export function LeaveBalanceCard() {
  const balances = useLeaveStore((s) => s.balances)
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut', delay: 0.24 }}
    >
      <Card className="p-5 sm:p-6">
        <h3 className="font-display text-sm font-black uppercase tracking-tight">
          Leave balance
        </h3>
        <div className="mt-4 space-y-4">
          {balances.map((balance, i) => (
            <div key={balance.type}>
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-medium">
                  {LEAVE_TYPE_LABELS[balance.type]}
                </p>
                <p className="text-xs text-ink-muted">
                  {balance.used}/{balance.total} used
                </p>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-elevated">
                <motion.div
                  className="h-full rounded-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(balance.used / balance.total) * 100}%`,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: 'easeOut',
                    delay: 0.35 + i * 0.08,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          className="mt-5 w-full"
          onClick={() => navigate('/leave')}
        >
          Request leave
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      </Card>
    </motion.div>
  )
}
