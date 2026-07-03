import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import type { Announcement } from '../../types'
import { Badge, Button, Card } from '../../components/ui'
import { formatDate, timeAgo } from '../../lib/utils'
import { CATEGORY_META } from './categoryMeta'
import { useSummarize } from './useSummarize'
import { AiSummaryBlock } from './AiSummaryBlock'

const COLLAPSED_PX = 72 // three lines at leading-6 (24px)

interface AnnouncementCardProps {
  announcement: Announcement
  index: number
}

export function AnnouncementCard({ announcement, index }: AnnouncementCardProps) {
  const { entry, summary, loading, error, run } = useSummarize(announcement.id)
  const [expanded, setExpanded] = useState(false)
  const [clampable, setClampable] = useState(true)
  const bodyRef = useRef<HTMLParagraphElement>(null)
  const category = CATEGORY_META[announcement.category]

  useEffect(() => {
    const el = bodyRef.current
    if (el) setClampable(el.scrollHeight > COLLAPSED_PX + 4)
  }, [])

  const summarize = (force = false) =>
    run(
      { text: `${announcement.title}\n\n${announcement.body}`, mode: 'single' },
      { force },
    )

  const showBlock = loading || error || Boolean(summary)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut', delay: Math.min(index, 8) * 0.06 }}
    >
      <Card className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Badge variant={category.variant}>{category.label}</Badge>
            <span className="text-xs text-ink-faint">
              {formatDate(announcement.date)}
            </span>
          </div>
          {!summary && !loading && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => summarize()}
              aria-label={`Summarize “${announcement.title}” with AI`}
            >
              <Sparkles className="size-4 text-accent" aria-hidden />
              Summarize
            </Button>
          )}
        </div>

        <h2 className="mt-3 text-lg font-semibold text-ink">{announcement.title}</h2>

        <motion.div
          initial={false}
          animate={{ height: expanded ? 'auto' : COLLAPSED_PX }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative mt-1.5 overflow-hidden"
        >
          <p ref={bodyRef} className="text-sm leading-6 text-ink-muted">
            {announcement.body}
          </p>
          {!expanded && clampable && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-surface to-transparent" />
          )}
        </motion.div>

        {clampable && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-2 text-xs font-medium text-accent transition-colors hover:text-accent/80"
          >
            {expanded ? 'Read less' : 'Read more'}
          </button>
        )}

        <AnimatePresence initial={false}>
          {showBlock && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="pt-4">
                <AiSummaryBlock
                  summary={summary}
                  loading={loading}
                  error={error}
                  caption={entry ? `Generated ${timeAgo(entry.at)} · Gemini` : undefined}
                  onRegenerate={() => summarize(true)}
                  onRetry={() => summarize(true)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}
