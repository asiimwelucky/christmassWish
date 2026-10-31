'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import AnimatedHollyDecoration from './AnimatedHollyDecoration'
import ChristmasRose from './ChristmasRose'
import EvergreenSprig from './EvergreenSprig'
import GoldSparkles from './GoldSparkles'
import MistletoeSprig from './MistletoeSprig'
import PoinsettiaDecoration from './PoinsettiaDecoration'

export type ChristmasFlowerKind =
  | 'poinsettia'
  | 'white-poinsettia'
  | 'cream-poinsettia'
  | 'christmas-rose'
  | 'holly'
  | 'mistletoe'
  | 'evergreen'

interface ChristmasFlowerProps {
  kind?: ChristmasFlowerKind
  /** Longest edge in px. */
  size?: number
  foliage?: boolean
  glow?: boolean
  sparkles?: boolean
  /** Snow dabs on the evergreen kind. */
  snow?: boolean
  /** CSS float + sway loop. */
  float?: boolean
  /** Unfolds on mount. */
  bloom?: boolean
  detail?: 'high' | 'low'
  angle?: number
  flipX?: boolean
  flipY?: boolean
  seed?: number
  duration?: number
  delay?: number
  className?: string
  style?: React.CSSProperties
}

/**
 * One entry point for every botanical motif, so pages never import five
 * sibling components to decorate a header.
 */
export default function ChristmasFlower({
  kind = 'poinsettia',
  size = 120,
  foliage = true,
  glow = true,
  sparkles = false,
  snow = true,
  float = false,
  bloom = false,
  detail = 'high',
  angle = 0,
  flipX = false,
  flipY = false,
  seed = 1,
  duration = 7,
  delay = 0,
  className = '',
  style,
}: ChristmasFlowerProps) {
  const reduced = useReducedMotion()

  const body = (() => {
    switch (kind) {
      case 'poinsettia':
        return (
          <PoinsettiaDecoration
            size={size}
            variant="red"
            foliage={foliage}
            glow={glow}
            sparkles={sparkles}
            detail={detail}
            angle={angle}
            seed={seed}
            duration={duration}
            delay={delay}
          />
        )
      case 'white-poinsettia':
      case 'cream-poinsettia':
        return (
          <PoinsettiaDecoration
            size={size}
            variant={kind === 'white-poinsettia' ? 'white' : 'cream'}
            foliage={foliage}
            glow={glow}
            sparkles={sparkles}
            detail={detail}
            angle={angle}
            seed={seed}
            duration={duration}
            delay={delay}
          />
        )
      case 'christmas-rose':
        return (
          <ChristmasRose
            size={size}
            glow={glow}
            angle={angle}
            flipX={flipX}
            flipY={flipY}
            seed={seed}
            duration={duration}
            delay={delay}
          />
        )
      case 'holly':
        return (
          <AnimatedHollyDecoration
            width={size}
            height={size * 0.75}
            angle={angle}
            flipX={flipX}
            flipY={flipY}
            seed={seed}
            duration={duration}
            delay={delay}
            glow={glow}
          />
        )
      case 'mistletoe':
        return (
          <MistletoeSprig
            width={size}
            height={size * 0.72}
            angle={angle}
            flipX={flipX}
            flipY={flipY}
            seed={seed}
            duration={duration}
            delay={delay}
          />
        )
      case 'evergreen':
        return (
          <EvergreenSprig
            width={size}
            height={size * 0.55}
            detail={detail}
            angle={angle}
            flipX={flipX}
            flipY={flipY}
            seed={seed}
            duration={duration}
            delay={delay}
            glow={glow}
            snow={snow}
          />
        )
    }
  })()

  const wrapperClass = [
    'inline-block',
    float && !reduced ? 'floral-float' : '',
    sparkles ? 'relative' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const inner = (
    <>
      {body}
      {sparkles && !reduced && <GoldSparkles count={5} seed={seed + 3} maxRadius={4} />}
    </>
  )

  if (!bloom || reduced) {
    return (
      <span className={wrapperClass} style={{ ...style, animationDuration: `${duration * 0.9}s`, animationDelay: `${-delay}s` }}>
        {inner}
      </span>
    )
  }

  return (
    <motion.span
      className={wrapperClass}
      style={{ ...style, animationDuration: `${duration * 0.9}s`, animationDelay: `${-delay}s` }}
      initial={{ scale: 0.72, opacity: 0, rotate: angle - 10 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 46, damping: 15, mass: 0.9, delay: delay * 0.25 }}
    >
      {inner}
    </motion.span>
  )
}
