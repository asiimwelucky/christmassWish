'use client'

import React from 'react'
import { FLORAL, bractPath, floralSeed } from './palette'

interface Petal {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  drift: number
  hue: string
  turn: number
  narrowOnly: boolean
}

interface FallingPetalsProps {
  /** Petals released per cycle — keep low, this layer is decoration not weather. */
  count?: number
  /** Change it to re-scatter the drift; the geometry stays deterministic. */
  seed?: number
  className?: string
}

const HUES = [FLORAL.bractRed, FLORAL.bractRedBright, FLORAL.bractWhite, FLORAL.goldLight]

/**
 * Occasional bracts drifting down the page. Seeded rather than random so the
 * markup is identical on server and client — no prerender blocking, and the
 * reduced-motion stylesheet hides the layer without any JS check.
 */
export default function FallingPetals({ count = 7, seed = 7, className = '' }: FallingPetalsProps) {
  const keepOnNarrow = Math.max(3, Math.round(count * 0.55))

  const petals: Petal[] = Array.from({ length: count }, (_, i) => {
    const s = seed * 97 + i
    return {
      id: i,
      left: floralSeed(s, 1) * 100,
      size: 9 + floralSeed(s, 2) * 11,
      duration: 13 + floralSeed(s, 3) * 12,
      delay: floralSeed(s, 4) * 16,
      drift: (floralSeed(s, 5) - 0.5) * 160,
      hue: HUES[i % HUES.length],
      turn: floralSeed(s, 6) > 0.5 ? 1 : -1,
      narrowOnly: i >= keepOnNarrow,
    }
  })

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-40 overflow-hidden ${className}`}
      role="presentation"
      aria-hidden="true"
    >
      {petals.map((p) => (
        <span
          key={p.id}
          className={`floral-petal absolute ${p.narrowOnly ? 'hidden sm:block' : ''}`}
          style={
            {
              left: `${p.left.toFixed(2)}%`,
              width: `${p.size.toFixed(1)}px`,
              height: `${(p.size * 1.25).toFixed(1)}px`,
              animationDuration: `${p.duration.toFixed(2)}s`,
              animationDelay: `${(-p.delay).toFixed(2)}s`,
              '--petal-drift': `${p.drift.toFixed(1)}px`,
              '--petal-spin': `${p.turn * 260}deg`,
            } as React.CSSProperties
          }
        >
          <svg
            width={p.size}
            height={p.size * 1.25}
            viewBox="-20 -26 40 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d={bractPath(24, 16)} fill={p.hue} opacity="0.9" />
          </svg>
        </span>
      ))}
    </div>
  )
}
