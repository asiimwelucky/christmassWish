'use client'

import React from 'react'
import { FLORAL, hollyLeafPath, floralSeed, orientationTransform } from './palette'
import { useFloralReducedMotion, useFloralUid } from './useFloral'

interface AnimatedHollyDecorationProps {
  width?: number
  height?: number
  /** Number of leaves fanning from the stem base. */
  leaves?: number
  berries?: number
  glow?: boolean
  sway?: boolean
  /** Intrinsic mirroring/rotation — kept inside the SVG so html2canvas
   *  captures card corners without relying on CSS transforms. */
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

const STEM = {
  p0: { x: -4, y: 6 },
  p1: { x: 28, y: 2 },
  p2: { x: 62, y: -10 },
  p3: { x: 106, y: -30 },
}

/** Point and tangent along the stem, so each leaf hangs off the branch it grows from. */
function stemAt(t: number) {
  const mt = 1 - t
  const { p0, p1, p2, p3 } = STEM
  return {
    x: mt ** 3 * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t ** 3 * p3.x,
    y: mt ** 3 * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t ** 3 * p3.y,
    angle:
      (Math.atan2(
        3 * mt * mt * (p1.y - p0.y) + 6 * mt * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y),
        3 * mt * mt * (p1.x - p0.x) + 6 * mt * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x)
      ) *
        180) /
      Math.PI,
  }
}

/**
 * Spiny holly leaves struck in pairs along a curved stem, closed by a glossy
 * berry cluster at the fork. Radiating from the stem instead of one point is
 * what keeps this legible (and not a green blob) at 60-120px.
 */
export default function AnimatedHollyDecoration({
  width = 160,
  height = 120,
  leaves = 5,
  berries = 6,
  glow = false,
  sway = true,
  flipX = false,
  flipY = false,
  angle = 0,
  seed = 2,
  duration = 8,
  delay = 0,
  x,
  y,
  className = '',
  style,
}: AnimatedHollyDecorationProps) {
  const uid = useFloralUid('holly')
  const reduced = useFloralReducedMotion()
  const animate = sway && !reduced

  const originX = 18
  const originY = 104

  const leafSpecs = Array.from({ length: leaves }, (_, i) => {
    const last = i === leaves - 1
    const t = leaves === 1 ? 0.5 : 0.18 + (i / (leaves - 1)) * 0.64
    const node = stemAt(t)
    const side = i % 2 === 0 ? -1 : 1
    // A terminal leaf continues the stem rather than joining the fan.
    const swing = last ? (floralSeed(seed + i, 5) - 0.5) * 14 : side * (46 + floralSeed(seed + i, 7) * 12)
    return {
      x: node.x,
      y: node.y,
      fanAngle: node.angle + swing,
      length: (54 - t * 12 + floralSeed(seed + i, 9) * 14) * (last ? 1.12 : 1),
      widthRatio: 0.34 + floralSeed(seed + i, 13) * 0.05,
    }
  })

  const berryNode = stemAt(0.3)

  const berrySpecs = Array.from({ length: berries }, (_, i) => {
    const a = (360 / berries) * i + floralSeed(seed + i, 21) * 30
    const r = 6 + floralSeed(seed + i, 23) * 8
    return {
      x: Math.cos((a * Math.PI) / 180) * r,
      y: Math.sin((a * Math.PI) / 180) * r * 0.72,
      radius: 4.6 + floralSeed(seed + i, 29) * 2.2,
    }
  })

  const orientation = orientationTransform(170, 130, { angle, flipX, flipY })

  return (
    <svg
      x={x}
      y={y}
      width={width}
      height={height}
      viewBox="0 0 170 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-leaf`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor={FLORAL.leafShadow} />
          <stop offset="45%" stopColor={FLORAL.leafDeep} />
          <stop offset="100%" stopColor={FLORAL.leafBright} />
        </linearGradient>
        <linearGradient id={`${uid}-leafFront`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor={FLORAL.leafDeep} />
          <stop offset="50%" stopColor={FLORAL.leaf} />
          <stop offset="100%" stopColor={FLORAL.leafLight} />
        </linearGradient>
        <radialGradient id={`${uid}-berry`} cx="0.33" cy="0.28" r="0.78">
          <stop offset="0%" stopColor={FLORAL.berryBright} />
          <stop offset="55%" stopColor={FLORAL.berry} />
          <stop offset="100%" stopColor={FLORAL.berryDeep} />
        </radialGradient>
        <radialGradient id={`${uid}-halo`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={FLORAL.goldLight} stopOpacity="0.22" />
          <stop offset="100%" stopColor={FLORAL.gold} stopOpacity="0" />
        </radialGradient>
      </defs>

      {glow && <ellipse cx="100" cy="70" rx="86" ry="62" fill={`url(#${uid}-halo)`} />}

      {/* One orientation group keeps mirroring inside SVG user units. */}
      <g transform={orientation}>
        <g transform={`translate(${originX} ${originY})`}>
        {/* Stem */}
        <path
          d={`M${STEM.p0.x},${STEM.p0.y} C ${STEM.p1.x},${STEM.p1.y} ${STEM.p2.x},${STEM.p2.y} ${STEM.p3.x},${STEM.p3.y}`}
          stroke={FLORAL.leafShadow}
          strokeWidth="3.4"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />

        <g>
          {animate && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="-1.8;1.4;-1.8"
              dur={`${duration}s`}
              begin={`${-delay}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            />
          )}

          {leafSpecs.map((leaf, i) => (
            <g
              key={`hl-${i}`}
              transform={`translate(${leaf.x.toFixed(1)} ${leaf.y.toFixed(1)}) rotate(${leaf.fanAngle.toFixed(1)})`}
            >
              <path
                d={hollyLeafPath(leaf.length, leaf.length * leaf.widthRatio)}
                fill={`url(#${i % 2 === 0 ? `${uid}-leaf` : `${uid}-leafFront`})`}
                stroke={FLORAL.leafShadow}
                strokeOpacity="0.55"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
              <path
                d={`M2,0 L${(leaf.length * 0.94).toFixed(1)},0`}
                stroke={FLORAL.veinGreen}
                strokeOpacity="0.5"
                strokeWidth="0.9"
                strokeLinecap="round"
              />
              {[0.3, 0.52, 0.72].map((t, k) => (
                <path
                  key={k}
                  d={`M${(leaf.length * t).toFixed(1)},0 L${(leaf.length * (t + 0.12)).toFixed(1)},${(-leaf.length * 0.11).toFixed(1)}`}
                  stroke={FLORAL.veinGreen}
                  strokeOpacity="0.35"
                  strokeWidth="0.7"
                  strokeLinecap="round"
                />
              ))}
            </g>
          ))}
        </g>

        {/* Berry cluster sits in the fork, lifted clear of the leaves. */}
        <g transform={`translate(${berryNode.x.toFixed(1)} ${(berryNode.y - 15).toFixed(1)})`}>
          {animate && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values={`${berryNode.x.toFixed(1)},${(berryNode.y - 15).toFixed(1)};${berryNode.x.toFixed(1)},${(berryNode.y - 17).toFixed(1)};${berryNode.x.toFixed(1)},${(berryNode.y - 15).toFixed(1)}`}
              dur={`${(duration * 0.8).toFixed(2)}s`}
              begin={`${-delay * 0.5}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            />
          )}
          <path
            d={`M0,15 L-5,4 M0,15 L5,2 M0,15 L11,7`}
            stroke={FLORAL.leafShadow}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          {berrySpecs.map((b, i) => (
            <g key={`by-${i}`} transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)})`}>
              <circle r={b.radius.toFixed(1)} fill={`url(#${uid}-berry)`} />
              <circle
                cx={(-b.radius * 0.3).toFixed(1)}
                cy={(-b.radius * 0.34).toFixed(1)}
                r={(b.radius * 0.24).toFixed(1)}
                fill={FLORAL.snow}
                opacity="0.55"
              />
              <circle
                cx={(b.radius * 0.2).toFixed(1)}
                cy={(b.radius * 0.4).toFixed(1)}
                r={(b.radius * 0.14).toFixed(1)}
                fill={FLORAL.berryDeep}
                opacity="0.5"
              />
            </g>
          ))}
        </g>
      </g>
      </g>
    </svg>
  )
}
