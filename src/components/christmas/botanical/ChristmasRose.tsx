'use client'

import React from 'react'
import { FLORAL, bractVeinPath, floralSeed, petalAngles, rosePetalPath } from './palette'
import { useFloralReducedMotion, useFloralUid } from './useFloral'

interface ChristmasRoseProps {
  size?: number
  glow?: boolean
  sway?: boolean
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
 * Hellebore — the Christmas rose. Rounded overlapping petals in ivory with a
 * faint green flush, ringed by golden stamens.
 */
export default function ChristmasRose({
  size = 96,
  glow = true,
  sway = true,
  angle = 0,
  flipX = false,
  flipY = false,
  seed = 3,
  duration = 7.5,
  delay = 0,
  className = '',
  style,
}: ChristmasRoseProps) {
  const uid = useFloralUid('rose')
  const reduced = useFloralReducedMotion()
  const animate = sway && !reduced

  const backPetals = petalAngles(7, 0)
  const frontPetals = petalAngles(6, 30)

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${uid}-back`} cx="0.5" cy="0.95" r="0.9">
          <stop offset="0%" stopColor={FLORAL.rosePetalShade} />
          <stop offset="55%" stopColor={FLORAL.rosePetal} />
          <stop offset="100%" stopColor={FLORAL.snow} />
        </radialGradient>
        <radialGradient id={`${uid}-front`} cx="0.5" cy="0.95" r="0.9">
          <stop offset="0%" stopColor="#DCD6C6" />
          <stop offset="45%" stopColor={FLORAL.rosePetal} />
          <stop offset="100%" stopColor={FLORAL.snow} />
        </radialGradient>
        <radialGradient id={`${uid}-halo`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={FLORAL.pollen} stopOpacity="0.3" />
          <stop offset="100%" stopColor={FLORAL.gold} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-centre`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={FLORAL.leafLight} />
          <stop offset="70%" stopColor={FLORAL.leaf} />
          <stop offset="100%" stopColor={FLORAL.leafDeep} />
        </radialGradient>
      </defs>

      {/* Content is already centred on the origin, so rotate/scale here pivot about the bloom. */}
      <g
        transform={`translate(100 100) rotate(${angle}) scale(${flipX ? -1 : 1} ${flipY ? -1 : 1})`}
      >
        {glow && <circle r="92" fill={`url(#${uid}-halo)`} />}

        <g>
          {animate && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="-2;2;-2"
              dur={`${duration}s`}
              begin={`${-delay}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            />
          )}

          {backPetals.map((a, i) => {
            const len = 70 + floralSeed(seed + i, 7) * 8
            return (
              <g key={`bp-${i}`} transform={`rotate(${a + (floralSeed(seed + i, 11) - 0.5) * 6})`}>
                <path
                  d={rosePetalPath(len, 56)}
                  fill={`url(#${uid}-back)`}
                  stroke="#CFC6B4"
                  strokeOpacity="0.5"
                  strokeWidth="0.7"
                />
                <path
                  d={bractVeinPath(len, 40)}
                  fill="none"
                  stroke={FLORAL.roseVein}
                  strokeOpacity="0.55"
                  strokeWidth="0.7"
                  strokeLinecap="round"
                />
              </g>
            )
          })}

          {frontPetals.map((a, i) => {
            const len = 56 + floralSeed(seed + i, 17) * 7
            const petalAnim = animate && i % 2 === 0
            return (
              <g key={`fp-${i}`} transform={`rotate(${a})`}>
                <g>
                  {petalAnim && (
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values="-1;1;-1"
                      dur={`${(duration * 0.9).toFixed(2)}s`}
                      begin={`${(-i * 0.6).toFixed(2)}s`}
                      repeatCount="indefinite"
                      calcMode="spline"
                      keyTimes="0;0.5;1"
                      keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
                    />
                  )}
                  <path
                    d={rosePetalPath(len, 48)}
                    fill={`url(#${uid}-front)`}
                    stroke="#D6CCB9"
                    strokeOpacity="0.45"
                    strokeWidth="0.7"
                  />
                  <path
                    d={bractVeinPath(len, 34)}
                    fill="none"
                    stroke={FLORAL.roseVein}
                    strokeOpacity="0.45"
                    strokeWidth="0.7"
                    strokeLinecap="round"
                  />
                </g>
              </g>
            )
          })}

          {/* Stamens + pistil cluster */}
          <circle r="15" fill={`url(#${uid}-centre)`} opacity="0.9" />
          {petalAngles(14, 0).map((a, i) => {
            const r = 17 + floralSeed(seed + i, 23) * 5
            return (
              <g key={`st-${i}`} transform={`rotate(${a})`}>
                <line
                  x1="0"
                  y1="-6"
                  x2="0"
                  y2={-r}
                  stroke={FLORAL.goldLight}
                  strokeWidth="1"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                <circle cx="0" cy={-r} r="1.7" fill={FLORAL.pollen} />
              </g>
            )
          })}
          {petalAngles(5, 20).map((a, i) => (
            <ellipse
              key={`pi-${i}`}
              rx="2.6"
              ry="3.6"
              transform={`rotate(${a}) translate(0 -5)`}
              fill={FLORAL.roseCentre}
              opacity="0.95"
            />
          ))}
        </g>
      </g>
    </svg>
  )
}
