import { RotateCw, Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils'

interface AiSummaryBlockProps {
  summary?: string
  loading: boolean
  error: boolean
  caption?: string
  onRegenerate: () => void
  onRetry: () => void
}

/** Orange-tinted AI output block. It is an aria-live region so screen readers
 *  announce the summary once it arrives. */
export function AiSummaryBlock({
  summary,
  loading,
  error,
  caption,
  onRegenerate,
  onRetry,
}: AiSummaryBlockProps) {
  return (
    <div
      aria-live="polite"
      className="rounded-xl border-l-2 border-accent bg-accent/10 p-3.5"
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-accent uppercase">
          <Sparkles
            className={cn('size-3.5', loading && 'animate-pulse')}
            aria-hidden
          />
          AI Summary
        </span>
        {summary && !loading && (
          <button
            type="button"
            onClick={onRegenerate}
            aria-label="Regenerate summary"
            className="flex size-6 items-center justify-center rounded-lg text-ink-faint transition-colors duration-200 hover:bg-accent/10 hover:text-accent"
          >
            <RotateCw className="size-3.5" aria-hidden />
          </button>
        )}
      </div>

      <div className="mt-2 text-sm">
        {loading ? (
          <div className="flex items-center gap-2 text-ink-muted">
            <Sparkles className="size-4 animate-pulse text-accent" aria-hidden />
            Summarizing…
          </div>
        ) : error ? (
          <p className="text-negative/90">
            AI unavailable —{' '}
            <button
              type="button"
              onClick={onRetry}
              className="font-medium underline underline-offset-2 hover:text-negative"
            >
              try again
            </button>
          </p>
        ) : (
          <p className="leading-relaxed text-ink">{summary}</p>
        )}
      </div>

      {summary && !loading && caption && (
        <p className="mt-2 text-[11px] text-ink-faint">{caption}</p>
      )}
    </div>
  )
}
