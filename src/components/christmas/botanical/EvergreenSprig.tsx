'use client'

import React from 'react'
import { FLORAL, floralSeed, orientationTransform } from './palette'
import { useFloralReducedMotion, useFloralUid } from './useFloral'

interface EvergreenSprigProps {
  width?: number
  height?: number
  /** Needle pairs struck along the branch. */
  nodes?: number
  snow?: boolean
  gold?: boolean
  glow?: boolean
  sway?: boolean
  detail?: 'high' | 'low'
  /** In-SVG orientation, so card corners capture without CSS transforms. */
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

const P0 = { x: 10, y: 92 }
const P1 = { x: 96, y: 58 }
const P2 = { x: 190, y: 20 }

/** Point and tangent along the quadratic stem, so needles follow the branch. */
function stemAt(t: number) {
  const mt = 1 - t
  return {
    x: mt * mt * P0.x + 2 * mt * t * P1.x + t * t * P2.x,
    y: mt * mt * P0.y + 2 * mt * t * P1.y + t * t * P2.y,
    dx: 2 * mt * (P1.x - P0.x) + 2 * t * (P2.x - P1.x),
    dy: 2 * mt * (P1.y - P0.y) + 2 * t * (P2.y - P1.y),
  }
}

/**
 * Pine/fir branch: needles fanned from a curved stem, with optional snow dabs
 * and golden beads. Used as filler foliage inside every arrangement.
 */
export default function EvergreenSprig({
  width = 170,
  height = 90,
  nodes = 10,
  snow = true,
  gold = true,
  glow = false,
  sway = true,
  detail = 'high',
  flipX = false,
  flipY = false,
  angle = 0,
  seed = 5,
  duration = 9,
  delay = 0,
  x,
  y,
  className = '',
  style,
}: EvergreenSprigProps) {
  const uid = useFloralUid('ever')
  const reduced = useFloralReducedMotion()
  const animate = sway && !reduced

  const stemPath = `M${P0.x},${P0.y} Q${P1.x},${P1.y} ${P2.x},${P2.y}`
  const needles: Array<{ x1: number; y1: number; x2: number; y2: number; tone: string; w: number }> = []
  const dabs: Array<{ x: number; y: number; r: number }> = []

  for (let n = 0; n < nodes; n++) {
    const t = 0.04 + (n / (nodes - 1)) * 0.92
    const p = stemAt(t)
    const baseAngle = (Math.atan2(p.dy, p.dx) * 180) / Math.PI
    const taper = 1 - t * 0.55

    const perSide = detail === 'high' ? 3 : 2
    for (const side of [-1, 1]) {
      for (let k = 0; k < perSide; k++) {
        const spread = side * (26 + k * 21) + (floralSeed(seed + n + k, 3) - 0.5) * 8
        const a = ((baseAngle + spread) * Math.PI) / 180
        const len = (15 + k * 4.5 + floralSeed(seed + n, k + 7) * 6) * taper
        const x2 = p.x + Math.cos(a) * len
        const y2 = p.y + Math.sin(a) * len
        needles.push({
          x1: p.x,
          y1: p.y,
          x2,
          y2,
          tone: k === perSide - 1 ? FLORAL.leafBright : k % 2 === 0 ? FLORAL.leaf : FLORAL.leafDeep,
          w: 1.5 - k * 0.2,
        })
        if (snow && k === perSide - 1 && n % 2 === 0) {
          dabs.push({ x: x2, y: y2, r: 1.6 + floralSeed(seed + n, 11) * 1.4 })
        }
      }
    }
  }

  const goldBeads = gold
    ? [0.28, 0.55, 0.78].map((t, i) => {
        const p = stemAt(t)
        return { x: p.x, y: p.y - 6 - floralSeed(seed + i, 17) * 5, r: 2.4 + floralSeed(seed + i, 19) * 1.6 }
      })
    : []

  const orientation = orientationTransform(200, 110, { angle, flipX, flipY })

  return (
    <svg
      x={x}
      y={y}
      width={width}
      height={height}
      viewBox="0 0 200 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-stem`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor={FLORAL.leafShadow} />
          <stop offset="100%" stopColor={FLORAL.leafDeep} />
        </linearGradient>
        <radialGradient id={`${uid}-bead`} cx="0.32" cy="0.28" r="0.8">
          <stop offset="0%" stopColor={FLORAL.goldPale} />
          <stop offset="55%" stopColor={FLORAL.gold} />
          <stop offset="100%" stopColor={FLORAL.goldDeep} />
        </radialGradient>
        <radialGradient id={`${uid}-halo`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={FLORAL.goldLight} stopOpacity="0.2" />
          <stop offset="100%" stopColor={FLORAL.gold} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={orientation}>
      {glow && <ellipse cx="100" cy="58" rx="98" ry="52" fill={`url(#${uid}-halo)`} />}

      <g>
        {animate && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-1.2;1.2;-1.2"
            dur={`${duration}s`}
            begin={`${-delay}s`}
            repeatCount="indefinite"
            calcMode="spline"
            keyTimes="0;0.5;1"
            keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
          />
        )}

        {needles.map((nd, i) => (
          <line
            key={`nd-${i}`}
            x1={nd.x1.toFixed(1)}
            y1={nd.y1.toFixed(1)}
            x2={nd.x2.toFixed(1)}
            y2={nd.y2.toFixed(1)}
            stroke={nd.tone}
            strokeWidth={nd.w.toFixed(2)}
            strokeLinecap="round"
          />
        ))}

        <path
          d={stemPath}
          stroke={`url(#${uid}-stem)`}
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />

        {goldBeads.map((b, i) => (
          <g key={`gb-${i}`}>
            <circle cx={b.x.toFixed(1)} cy={b.y.toFixed(1)} r={b.r.toFixed(1)} fill={`url(#${uid}-bead)`} />
            <circle
              cx={(b.x - b.r * 0.3).toFixed(1)}
              cy={(b.y - b.r * 0.34).toFixed(1)}
              r={(b.r * 0.26).toFixed(1)}
              fill={FLORAL.pollen}
              opacity="0.8"
            />
          </g>
        ))}

        {snow &&
          dabs.map((d, i) => (
            <circle
              key={`sn-${i}`}
              cx={d.x.toFixed(1)}
              cy={d.y.toFixed(1)}
              r={d.r.toFixed(1)}
              fill={FLORAL.snow}
              opacity="0.62"
            />
          ))}
      </g>
      </g>
    </svg>
  )
}
