'use client'

import React from 'react'
import ChristmasFlower, { type ChristmasFlowerKind } from './ChristmasFlower'

interface AmbientBloom {
  kind: ChristmasFlowerKind
  size: number
  position: React.CSSProperties
  duration: number
  delay: number
  opacity: number
  angle?: number
  detail?: 'high' | 'low'
  /** Tailwind visibility class — keeps mobile light without JS measurement. */
  visibility?: string
}

/**
 * Hand-placed rather than generated: the blooms stay in the corners and the
 * side gutters, clear of the light string above, the footer below and the
 * headline/counter/call to action in the centre column.
 */
const AMBIENT: AmbientBloom[] = [
  {
    kind: 'poinsettia',
    size: 104,
    position: { top: '9%', left: '-5%' },
    duration: 9.5,
    delay: 0.4,
    opacity: 0.92,
    angle: -12,
  },
  {
    kind: 'white-poinsettia',
    size: 74,
    position: { top: '17%', right: '-4%' },
    duration: 11.5,
    delay: 1.9,
    opacity: 0.82,
    angle: 16,
    detail: 'low',
  },
  {
    kind: 'evergreen',
    size: 148,
    position: { bottom: '15%', left: '-6%' },
    duration: 13,
    delay: 0.9,
    opacity: 0.7,
    angle: 16,
    detail: 'low',
    visibility: 'hidden sm:block',
  },
  {
    kind: 'holly',
    size: 118,
    position: { bottom: '11%', right: '-3%' },
    duration: 10.5,
    delay: 2.6,
    opacity: 0.8,
    angle: -6,
    detail: 'low',
  },
  {
    kind: 'christmas-rose',
    size: 56,
    position: { top: '44%', left: '1%' },
    duration: 12.5,
    delay: 1.3,
    opacity: 0.62,
    angle: 8,
    detail: 'low',
    visibility: 'hidden lg:block',
  },
  {
    kind: 'cream-poinsettia',
    size: 52,
    position: { top: '58%', right: '1.5%' },
    duration: 8.8,
    delay: 3.2,
    opacity: 0.6,
    angle: -20,
    detail: 'low',
    visibility: 'hidden xl:block',
  },
  {
    kind: 'mistletoe',
    size: 86,
    position: { top: '28%', left: '-1%' },
    duration: 14,
    delay: 0.2,
    opacity: 0.5,
    angle: 24,
    detail: 'low',
    visibility: 'hidden lg:block',
  },
]

interface FloatingChristmasFlowersProps {
  /** Sits behind page content; pass a higher value only for full-bleed sections. */
  zIndex?: number
  className?: string
}

/**
 * Ambient botanical border for hero and section backgrounds: blooms kept to
 * the margins, each on its own duration and phase so the page never pulses in
 * lockstep.
 */
export default function FloatingChristmasFlowers({
  zIndex = 0,
  className = '',
}: FloatingChristmasFlowersProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ zIndex }}
      role="presentation"
      aria-hidden="true"
    >
      {AMBIENT.map((bloom, i) => (
        <div
          key={`ambient-${i}`}
          className={`floral-float absolute ${bloom.visibility ?? ''}`}
          style={{
            ...bloom.position,
            animationDuration: `${bloom.duration}s`,
            animationDelay: `${-bloom.delay}s`,
            opacity: bloom.opacity,
            filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.35))',
          }}
        >
          <ChristmasFlower
            kind={bloom.kind}
            size={bloom.size}
            detail={bloom.detail ?? 'high'}
            glow={bloom.kind === 'poinsettia' || bloom.kind === 'white-poinsettia'}
            angle={bloom.angle}
            seed={i * 13 + 2}
            duration={bloom.duration * 0.85}
            delay={bloom.delay}
          />
        </div>
      ))}
    </div>
  )
}
