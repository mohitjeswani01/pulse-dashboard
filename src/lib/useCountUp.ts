import { useEffect, useState } from 'react'
import { animate, useReducedMotion } from 'framer-motion'

/**
 * Animate 0 → target on mount (~800ms easeOut) and return the current
 * frame value. Respects prefers-reduced-motion by jumping straight to target.
 */
export function useCountUp(target: number, duration = 0.8): number {
  const reducedMotion = useReducedMotion()
  const [value, setValue] = useState(reducedMotion ? target : 0)

  useEffect(() => {
    if (reducedMotion) return
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: setValue,
    })
    return () => controls.stop()
  }, [target, duration, reducedMotion])

  return reducedMotion ? target : value
}
