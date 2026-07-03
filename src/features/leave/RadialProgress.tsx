import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface RadialProgressProps {
  /** 0–1 portion of the ring to fill. */
  fraction: number
  size?: number
  stroke?: number
  children?: ReactNode
}

/** SVG ring: subtle track + orange arc that animates on mount and re-tweens
 *  smoothly whenever `fraction` changes (e.g. a balance decrementing). */
export function RadialProgress({
  fraction,
  size = 108,
  stroke = 9,
  children,
}: RadialProgressProps) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(1, fraction))
  const offset = circumference * (1 - clamped)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--line)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#FF5C00"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  )
}
