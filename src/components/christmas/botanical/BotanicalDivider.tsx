'use client'

import React from 'react'
import EvergreenSprig from './EvergreenSprig'
import PoinsettiaDecoration, { type PoinsettiaVariant } from './PoinsettiaDecoration'
import { FLORAL } from './palette'

interface BotanicalDividerProps {
  /** Bloom diameter at the centre of the rule. */
  size?: number
  variant?: PoinsettiaVariant
  /** Length of each hairline rule, in px. */
  ruleWidth?: number
  className?: string
}

/**
 * Section rule with a bloom at its centre — the upgrade over the old
 * glyph divider. Rules are plain divs so html2canvas rasterises them exactly
 * as the browser paints them.
 */
export default function BotanicalDivider({
  size = 34,
  variant = 'red',
  ruleWidth = 54,
  className = '',
}: BotanicalDividerProps) {
  return (
    <div
      className={`flex items-center justify-center gap-2 ${className}`}
      role="presentation"
      aria-hidden="true"
    >
      <span
        style={{
          height: 1,
          width: ruleWidth,
          background: `linear-gradient(90deg, rgba(212,175,55,0) 0%, ${FLORAL.gold} 100%)`,
          opacity: 0.75,
        }}
      />

      <span className="relative inline-flex items-center">
        {/* Left flank: branch tip points outward, base tucked under the bloom. */}
        <span style={{ width: size * 1.5, marginLeft: -size * 0.7, opacity: 0.9 }}>
          <EvergreenSprig
            width={size * 1.5}
            height={size * 0.62}
            nodes={5}
            detail="low"
            snow={false}
            gold
            flipX
            angle={-6}
            seed={3}
            duration={9}
          />
        </span>
        <PoinsettiaDecoration
          size={size}
          variant={variant}
          foliage={false}
          glow
          detail={size > 26 ? 'high' : 'low'}
          seed={7}
          duration={7.5}
        />
        <span style={{ width: size * 1.5, marginRight: -size * 0.7, opacity: 0.9 }}>
          <EvergreenSprig
            width={size * 1.5}
            height={size * 0.62}
            nodes={5}
            detail="low"
            snow
            gold
            angle={-6}
            seed={4}
            duration={9.6}
            delay={1.4}
          />
        </span>
      </span>

      <span
        style={{
          height: 1,
          width: ruleWidth,
          background: `linear-gradient(270deg, rgba(212,175,55,0) 0%, ${FLORAL.gold} 100%)`,
          opacity: 0.75,
        }}
      />
    </div>
  )
}
