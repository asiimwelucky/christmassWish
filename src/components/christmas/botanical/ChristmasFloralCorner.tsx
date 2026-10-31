'use client'

import React from 'react'
import AnimatedHollyDecoration from './AnimatedHollyDecoration'
import EvergreenSprig from './EvergreenSprig'
import MistletoeSprig from './MistletoeSprig'
import PoinsettiaDecoration, { type PoinsettiaVariant } from './PoinsettiaDecoration'
import { FLORAL, sparklePath } from './palette'
import { useFloralUid } from './useFloral'

export type CornerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

interface ChristmasFloralCornerProps {
  corner: CornerPosition
  /**
   * Side of the square corner box as a percentage of the container's width, so
   * the spray stays in proportion from a 260px phone card to a 450px desktop one.
   */
  sizePct?: number
  variant?: PoinsettiaVariant
  /** 'light' drops the mistletoe and the secondary bloom for smaller cards. */
  density?: 'full' | 'light'
  sway?: boolean
  /** Golden dust — SMIL, so it survives the html2canvas capture. */
  sparkles?: boolean
  seed?: number
  className?: string
  style?: React.CSSProperties
}

/** Nested viewport sizes, derived from each sprig's own aspect ratio. */
const EVERGREEN_AR = 200 / 110
const HOLLY_AR = 170 / 130
const MISTLETOE_AR = 160 / 120

/**
 * A card-corner floral arrangement: evergreen, holly and poinsettia composed
 * into a tapering spray that hugs the corner and stops short of the text.
 *
 * Everything — mirroring included — lives in one SVG viewBox, so the corner
 * scales with the card instead of drifting over the copy on narrow screens, and
 * html2canvas rasterises it as a single image without CSS transforms or
 * stylesheet classes.
 */
export default function ChristmasFloralCorner({
  corner,
  sizePct = 30,
  variant = 'red',
  density = 'full',
  sway = true,
  sparkles = true,
  seed = 1,
  className = '',
  style,
}: ChristmasFloralCornerProps) {
  const uid = useFloralUid('corner')
  const flipX = corner === 'top-right' || corner === 'bottom-right'
  const flipY = corner === 'bottom-left' || corner === 'bottom-right'
  const mirror = `translate(${flipX ? 100 : 0} ${flipY ? 100 : 0}) scale(${flipX ? -1 : 1} ${flipY ? -1 : 1})`

  const heroW = 62
  const secondW = 34
  const everW = 96
  const hollyW = 70
  const mistW = 52

  return (
    <div
      className={`pointer-events-none absolute ${className}`}
      style={{ width: `${sizePct}%`, aspectRatio: '1 / 1', ...style }}
      role="presentation"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={`${uid}-cast`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#02060D" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#02060D" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g transform={mirror}>
          {/* Cast shadow seats the spray on the card */}
          <circle cx="31" cy="31" r="30" fill={`url(#${uid}-cast)`} />

          <EvergreenSprig
            x={0}
            y={1}
            width={everW}
            height={everW / EVERGREEN_AR}
            nodes={density === 'full' ? 8 : 6}
            detail="low"
            snow
            gold
            sway={sway}
            angle={-6}
            seed={17 + seed}
            duration={9.5}
            delay={1.2}
          />

          <AnimatedHollyDecoration
            x={0}
            y={44}
            width={hollyW}
            height={hollyW / HOLLY_AR}
            leaves={density === 'full' ? 4 : 3}
            berries={5}
            glow={false}
            sway={sway}
            angle={-8}
            seed={31 + seed}
            duration={8.2}
            delay={0.4}
          />

          {density === 'full' && (
            <MistletoeSprig
              x={44}
              y={58}
              width={mistW}
              height={mistW / MISTLETOE_AR}
              pairs={2}
              berries={4}
              sway={sway}
              seed={47 + seed}
              duration={9}
              delay={2.1}
            />
          )}

          {density === 'full' && (
            <PoinsettiaDecoration
              x={60}
              y={46}
              size={secondW}
              variant={variant === 'red' ? 'cream' : 'red'}
              foliage={false}
              glow={false}
              detail="low"
              sway={sway}
              seed={71 + seed}
              duration={6.4}
              delay={2.6}
            />
          )}

          <PoinsettiaDecoration
            x={6}
            y={4}
            size={heroW}
            variant={variant}
            foliage
            glow
            detail="high"
            sway={sway}
            angle={14}
            seed={5 + seed}
            duration={7}
            delay={0}
          />

          {sparkles &&
            [
              { x: 20, y: 12, r: 2.4, dur: 3.1 },
              { x: 56, y: 30, r: 1.9, dur: 2.6 },
              { x: 34, y: 66, r: 2.2, dur: 3.7 },
            ].map((s, i) => (
              <path
                key={`${uid}-dust-${i}`}
                d={sparklePath(s.r)}
                transform={`translate(${s.x} ${s.y})`}
                fill={FLORAL.goldPale}
                opacity="0.85"
              >
                <animate
                  attributeName="opacity"
                  values="0.25;0.95;0.25"
                  dur={`${s.dur}s`}
                  begin={`${-i * 0.7}s`}
                  repeatCount="indefinite"
                />
              </path>
            ))}
        </g>
      </svg>
    </div>
  )
}
