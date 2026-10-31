'use client'

import React from 'react'
import { FLORAL } from './palette'
import { useFloralUid } from './useFloral'

interface GoldenStarProps {
  /** Rendered edge in px; the star is square. */
  size?: number
  glow?: boolean
  pulse?: boolean
  /** Outer bleed of the viewBox, so the halo never clips. */
  bleed?: number
  className?: string
  style?: React.CSSProperties
}

/**
 * Christmas topper star, shared by the tree and the skit's opening scene.
 *
 * Drawn from five outer and five inner vertices rather than a glyph, so it
 * scales crisply and picks up the same gradient light as the rest of the
 * botanical set. Resting opacity is the mid-point of the pulse, which keeps a
 * frozen html2canvas capture looking intentional.
 */
export default function GoldenStar({
  size = 56,
  glow = true,
  pulse = true,
  bleed = 44,
  className = '',
  style,
}: GoldenStarProps) {
  const uid = useFloralUid('star')
  const extent = bleed + 12
  const points = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? 40 : 16
    const a = (Math.PI / 5) * i - Math.PI / 2
    return `${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`
  }).join(' ')

  return (
    <svg
      width={size}
      height={size}
      viewBox={`${-extent} ${-extent} ${extent * 2} ${extent * 2}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${uid}-halo`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={FLORAL.goldPale} stopOpacity="0.55" />
          <stop offset="55%" stopColor={FLORAL.gold} stopOpacity="0.18" />
          <stop offset="100%" stopColor={FLORAL.gold} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={FLORAL.pollen} />
          <stop offset="45%" stopColor={FLORAL.goldLight} />
          <stop offset="100%" stopColor={FLORAL.gold} />
        </linearGradient>
      </defs>

      <g className={glow ? 'floral-glow' : undefined}>
        {glow && <circle r={bleed} fill={`url(#${uid}-halo)`} />}
        <polygon
          points={points}
          fill={`url(#${uid}-body)`}
          stroke={FLORAL.goldDeep}
          strokeOpacity="0.5"
          strokeWidth="1.2"
          strokeLinejoin="round"
        >
          {pulse && (
            <animate
              attributeName="opacity"
              values="0.92;1;0.92"
              dur="3.4s"
              repeatCount="indefinite"
            />
          )}
        </polygon>
        <circle r="7" fill={FLORAL.pollen} opacity="0.95" />
      </g>
    </svg>
  )
}
