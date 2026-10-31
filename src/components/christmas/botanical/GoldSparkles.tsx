'use client'

import React from 'react'
import { floralSeed, sparklePath } from './palette'

interface GoldSparklesProps {
  count?: number
  seed?: number
  /** Rendered inside a positioned parent; fills it. */
  className?: string
  /** Max star radius in px. */
  maxRadius?: number
}

/**
 * Golden dust for ambient UI.
 *
 * Each star is a positioned div wrapper so the CSS scale pulse rotates about
 * its own centre — animating transform on an SVG <g> would need transform-box
 * juggling across browsers. Skipped inside the html2canvas capture region,
 * where the poinsettia's own SMIL sparkles are used instead.
 */
export default function GoldSparkles({
  count = 9,
  seed = 12,
  className = '',
  maxRadius = 5,
}: GoldSparklesProps) {
  const sparkles = Array.from({ length: count }, (_, i) => {
    const r = 2.2 + floralSeed(seed + i, 3) * (maxRadius - 2.2)
    return {
      left: 3 + floralSeed(seed + i, 5) * 94,
      top: 3 + floralSeed(seed + i, 7) * 94,
      size: r * 2,
      duration: 2.4 + floralSeed(seed + i, 11) * 2.8,
      delay: floralSeed(seed + i, 13) * 4.5,
    }
  })

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      role="presentation"
      aria-hidden="true"
    >
      {sparkles.map((s, i) => (
        <span
          key={`gs-${i}`}
          className="floral-sparkle absolute block"
          style={{
            left: `${s.left.toFixed(2)}%`,
            top: `${s.top.toFixed(2)}%`,
            width: `${s.size.toFixed(1)}px`,
            height: `${s.size.toFixed(1)}px`,
            animationDuration: `${s.duration.toFixed(2)}s`,
            animationDelay: `${(-s.delay).toFixed(2)}s`,
          }}
        >
          <svg
            width={s.size}
            height={s.size}
            viewBox="-6 -6 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d={sparklePath(5)} fill="#F5D76E" />
            <path d={sparklePath(2.2)} fill="#FFF3CC" />
          </svg>
        </span>
      ))}
    </div>
  )
}
