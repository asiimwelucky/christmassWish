'use client'

import React from 'react'
import AnimatedHollyDecoration from './AnimatedHollyDecoration'
import ChristmasFlower from './ChristmasFlower'
import EvergreenSprig from './EvergreenSprig'
import GoldSparkles from './GoldSparkles'
import MistletoeSprig from './MistletoeSprig'
import { type PoinsettiaVariant } from './PoinsettiaDecoration'
import { FLORAL } from './palette'
import { useFloralUid } from './useFloral'

interface ChristmasBotanicalArrangementProps {
  /** Widest edge of the arrangement in px. */
  width?: number
  variant?: PoinsettiaVariant
  /** Golden dust over the spray. */
  sparkles?: boolean
  /** Unfold the blooms on mount. */
  bloom?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * The hero-scale spray: a crossed evergreen bed with the principal blooms
 * layered over it. Used on the landing hero, the skit finale and loading
 * screens, where there is room for a real arrangement rather than an accent.
 */
export default function ChristmasBotanicalArrangement({
  width = 420,
  variant = 'red',
  sparkles = true,
  bloom = true,
  className = '',
  style,
}: ChristmasBotanicalArrangementProps) {
  const uid = useFloralUid('arrangement')
  const height = width * 0.52
  const hero = width * 0.42
  const side = width * 0.26

  return (
    <div
      className={`relative ${className}`}
      style={{ width, height, ...style }}
      role="presentation"
      aria-hidden="true"
    >
      {/* Cast shadow to seat the spray on the page */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 52"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={`${uid}-cast`} cx="0.5" cy="0.62" r="0.5">
            <stop offset="0%" stopColor="#02060D" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#02060D" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="50" cy="34" rx="46" ry="17" fill={`url(#${uid}-cast)`} />
      </svg>

      {/* Crossed evergreen bed */}
      <div
        className="floral-float absolute"
        style={{
          left: '-2%',
          bottom: '10%',
          animationDuration: '12s',
          animationDelay: '-1.4s',
          opacity: 0.95,
        }}
      >
        <EvergreenSprig width={width * 0.62} height={width * 0.3} nodes={11} angle={-14} seed={11} duration={11} />
      </div>
      <div
        className="floral-float absolute"
        style={{
          right: '-2%',
          bottom: '10%',
          animationDuration: '13.5s',
          animationDelay: '-3.2s',
          opacity: 0.95,
        }}
      >
        <EvergreenSprig
          width={width * 0.62}
          height={width * 0.3}
          nodes={11}
          angle={14}
          flipX
          seed={19}
          duration={12}
          delay={2}
        />
      </div>

      {/* Holly rising behind on the right */}
      <div
        className="floral-float absolute"
        style={{ right: '4%', bottom: '16%', animationDuration: '10.5s', animationDelay: '-2.2s' }}
      >
        <AnimatedHollyDecoration
          width={width * 0.3}
          height={width * 0.22}
          leaves={4}
          berries={5}
          flipX
          angle={-10}
          seed={23}
          duration={9}
          delay={1.1}
        />
      </div>

      {/* Mistletoe trailing on the left */}
      <div
        className="floral-float absolute"
        style={{ left: '3%', bottom: '4%', animationDuration: '14s', animationDelay: '-0.8s', opacity: 0.92 }}
      >
        <MistletoeSprig width={width * 0.26} height={width * 0.19} seed={29} duration={10} delay={2.4} />
      </div>

      {/* Secondary blooms */}
      <div className="absolute" style={{ left: '13%', top: '22%' }}>
        <ChristmasFlower
          kind={variant === 'red' ? 'white-poinsettia' : 'poinsettia'}
          size={side}
          foliage={false}
          detail="high"
          angle={-16}
          float
          bloom={bloom}
          seed={37}
          duration={8.2}
          delay={0.7}
        />
      </div>
      <div className="absolute" style={{ right: '15%', top: '26%' }}>
        <ChristmasFlower
          kind="cream-poinsettia"
          size={side * 0.72}
          foliage={false}
          detail="high"
          angle={22}
          float
          bloom={bloom}
          seed={43}
          duration={7.4}
          delay={1.5}
        />
      </div>

      {/* Principal bloom */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{ transform: 'translate(-50%, -54%)', filter: `drop-shadow(0 8px 18px rgba(3,10,20,0.55))` }}
      >
        <ChristmasFlower
          kind={variant === 'red' ? 'poinsettia' : 'white-poinsettia'}
          size={hero}
          foliage
          glow
          sparkles={false}
          detail="high"
          float
          bloom={bloom}
          seed={5}
          duration={7}
        />
      </div>

      {sparkles && (
        <>
          <GoldSparkles count={10} seed={61} maxRadius={5} />
          <span
            className="floral-sparkle absolute rounded-full"
            style={{
              left: '46%',
              top: '12%',
              width: 5,
              height: 5,
              backgroundColor: FLORAL.goldPale,
              boxShadow: `0 0 10px 2px ${FLORAL.goldLight}`,
              animationDuration: '3.4s',
            }}
          />
        </>
      )}
    </div>
  )
}
