'use client'

import React from 'react'
import { FLORAL, floralSeed, mistletoeLeafPath, orientationTransform } from './palette'
import { useFloralReducedMotion, useFloralUid } from './useFloral'

interface MistletoeSprigProps {
  width?: number
  height?: number
  pairs?: number
  berries?: number
  sway?: boolean
  flipX?: boolean
  flipY?: boolean
  angle?: number
  seed?: number
  duration?: number
  delay?: number
  /** Placement inside a parent SVG viewBox, for nested arrangements. */
  x?: number
  y?: number
  className?: string
  style?: React.CSSProperties
}

/**
 * Mistletoe: paired smooth leaves on a forked stem with a cluster of waxy
 * white berries at the tip.
 */
export default function MistletoeSprig({
  width = 150,
  height = 110,
  pairs = 3,
  berries = 5,
  sway = true,
  flipX = false,
  flipY = false,
  angle = 0,
  seed = 8,
  duration = 8.5,
  delay = 0,
  x,
  y,
  className = '',
  style,
}: MistletoeSprigProps) {
  const uid = useFloralUid('mistle')
  const reduced = useFloralReducedMotion()
  const animate = sway && !reduced

  const nodes = Array.from({ length: pairs }, (_, i) => {
    const t = 0.16 + (i / Math.max(pairs - 1, 1)) * 0.62
    return {
      x: 14 + t * 108,
      y: 96 - t * 52,
      angle: -32 - (floralSeed(seed + i, 3) - 0.5) * 10,
      length: 34 + (1 - t) * 12,
    }
  })

  const tip = { x: 128, y: 40 }
  const orientation = orientationTransform(160, 120, { angle, flipX, flipY })

  return (
    <svg
      x={x}
      y={y}
      width={width}
      height={height}
      viewBox="0 0 160 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-leaf`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor={FLORAL.leafDeep} />
          <stop offset="55%" stopColor={FLORAL.leaf} />
          <stop offset="100%" stopColor={FLORAL.mistLEAF} />
        </linearGradient>
        <radialGradient id={`${uid}-berry`} cx="0.34" cy="0.28" r="0.8">
          <stop offset="0%" stopColor={FLORAL.snow} />
          <stop offset="60%" stopColor={FLORAL.berryWhite} />
          <stop offset="100%" stopColor={FLORAL.berryWhiteShade} />
        </radialGradient>
      </defs>

      <g transform={orientation}>
      <g>
        {animate && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-1.6;1.6;-1.6"
            dur={`${duration}s`}
            begin={`${-delay}s`}
            repeatCount="indefinite"
            calcMode="spline"
            keyTimes="0;0.5;1"
            keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
          />
        )}

        <path
          d="M10,100 C 50,88 92,66 128,40"
          stroke={FLORAL.leafShadow}
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />
        {nodes.map((n, i) => (
          <path
            key={`st-${i}`}
            d={`M${n.x.toFixed(1)},${n.y.toFixed(1)} q 8,-6 16,-14`}
            stroke={FLORAL.leafShadow}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />
        ))}

        {nodes.map((n, i) =>
          [-1, 1].map((side) => (
            <g
              key={`lf-${i}-${side}`}
              transform={`translate(${n.x.toFixed(1)} ${n.y.toFixed(1)}) rotate(${(n.angle + side * 44).toFixed(1)})`}
            >
              <path
                d={mistletoeLeafPath(n.length, n.length * 0.42)}
                fill={`url(#${uid}-leaf)`}
                stroke={FLORAL.veinGreen}
                strokeOpacity="0.4"
                strokeWidth="0.7"
              />
              <path
                d={`M1,0 L${(n.length * 0.9).toFixed(1)},0`}
                stroke={FLORAL.veinGreen}
                strokeOpacity="0.45"
                strokeWidth="0.8"
                strokeLinecap="round"
              />
            </g>
          ))
        )}

        {/* Berry cluster at the tip */}
        <g transform={`translate(${tip.x} ${tip.y})`}>
          {Array.from({ length: berries }, (_, i) => {
            const a = (360 / berries) * i + floralSeed(seed + i, 23) * 26
            const rad = 6 + floralSeed(seed + i, 29) * 7
            const x = Math.cos((a * Math.PI) / 180) * rad
            const y = Math.sin((a * Math.PI) / 180) * rad * 0.9 + 4
            const r = 4.4 + floralSeed(seed + i, 31) * 1.8
            return (
              <g key={`mb-${i}`} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
                <circle r={r.toFixed(1)} fill={`url(#${uid}-berry)`} />
                <circle
                  cx={(-r * 0.28).toFixed(1)}
                  cy={(-r * 0.3).toFixed(1)}
                  r={(r * 0.22).toFixed(1)}
                  fill={FLORAL.snow}
                  opacity="0.9"
                />
              </g>
            )
          })}
        </g>
      </g>
      </g>
    </svg>
  )
}
