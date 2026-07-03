import { AnimatePresence, motion } from 'framer-motion'
import { RotateCw, Sparkles } from 'lucide-react'
import type { Announcement } from '../../types'
import { Button } from '../../components/ui'
import { timeAgo } from '../../lib/utils'
import { useSummarize } from './useSummarize'

const MAX_DIGEST_INPUT = 5800

/** Compact the announcements into a single prompt that stays under the server cap. */
function buildDigestInput(announcements: Announcement[]): string {
  const text = announcements
    .map((a) => `${a.title}: ${a.body.slice(0, 380)}`)
    .join('\n\n')
  return text.slice(0, MAX_DIGEST_INPUT)
}

function toLines(summary: string): string[] {
  return summary
    .split('\n')
    .map((l) => l.replace(/^[\s\-•*]+/, '').trim())
    .filter(Boolean)
}

interface DigestCardProps {
  announcements: Announcement[]
}

export function DigestCard({ announcements }: DigestCardProps) {
  const { entry, summary, loading, error, run } = useSummarize('digest')

  const generate = (force = false) =>
    run({ text: buildDigestInput(announcements), mode: 'digest' }, { force })

  return (
    <div className="rounded-2xl bg-gradient-to-br from-accent/60 via-accent/15 to-amber/50 p-px shadow-[0_0_60px_-22px_rgba(255,92,0,0.7)]">
      <div className="rounded-[15px] bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-amber text-white">
              <Sparkles className="size-5" aria-hidden />
            </div>
            <div>
              <h2 className="font-display text-sm font-black tracking-tight uppercase">
                Today's Digest
              </h2>
              <p className="text-xs text-ink-muted">
                Every announcement, distilled by AI.
              </p>
            </div>
          </div>
          {!summary && (
            <Button onClick={() => generate()} loading={loading} disabled={loading}>
              {!loading && <Sparkles className="size-4" aria-hidden />}
              {loading ? 'Summarizing…' : 'Generate with AI'}
            </Button>
          )}
        </div>

        <div aria-live="polite">
          {error && !summary && (
            <p className="mt-4 text-sm text-negative/90">
              AI unavailable —{' '}
              <button
                type="button"
                onClick={() => generate(true)}
                className="font-medium underline underline-offset-2 hover:text-negative"
              >
                try again
              </button>
            </p>
          )}

          <AnimatePresence>
            {summary && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <ul className="mt-5 space-y-2.5">
                  {toLines(summary).map((line, i) => (
                    <motion.li
                      key={line}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut', delay: i * 0.12 }}
                      className="flex gap-2.5 text-sm text-ink"
                    >
                      <span
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent"
                        aria-hidden
                      />
                      <span className="leading-relaxed">{line}</span>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-[11px] text-ink-faint">
                    {entry ? `Generated ${timeAgo(entry.at)} · Gemini` : null}
                  </span>
                  <button
                    type="button"
                    onClick={() => generate(true)}
                    aria-label="Regenerate digest"
                    className="flex items-center gap-1 text-[11px] font-medium text-ink-muted transition-colors hover:text-accent"
                  >
                    <RotateCw className="size-3" aria-hidden />
                    Regenerate
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
