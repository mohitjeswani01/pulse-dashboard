import { useEffect, useState } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: boolean
}

/**
 * Fetch-on-mount helper for the skeleton → data | error pattern.
 * `load` must be referentially stable (module-level fn or useCallback),
 * otherwise the effect re-runs every render.
 */
export function useAsync<T>(
  load: () => Promise<T>,
): AsyncState<T> & { retry: () => void } {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: false,
  })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    load()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: false })
      })
      .catch(() => {
        if (!cancelled) setState({ data: null, loading: false, error: true })
      })
    return () => {
      cancelled = true
    }
  }, [load, attempt])

  const retry = () => {
    setState({ data: null, loading: true, error: false })
    setAttempt((a) => a + 1)
  }

  return { ...state, retry }
}
