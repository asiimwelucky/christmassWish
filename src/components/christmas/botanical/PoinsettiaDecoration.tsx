'use client'

import React from 'react'
import {
  FLORAL,
  bractHighlightPath,
  bractPath,
  bractVeinPath,
  floralSeed,
  petalAngles,
  sparklePath,
} from './palette'
import { useFloralReducedMotion, useFloralUid } from './useFloral'

export type PoinsettiaVariant = 'red' | 'white' | 'cream'

interface Shade {
  /** base → mid → tip → very tip */
  stops: [string, string, string, string]
  edge: string
  vein: string
  veinOpacity: number
  highlight: string
}

interface VariantSpec {
  back: Shade
  mid: Shade
  front: Shade
  cyathia: [string, string, string]
}

const VARIANTS: Record<PoinsettiaVariant, VariantSpec> = {
  red: {
    back: {
      stops: [FLORAL.bractRedShadow, FLORAL.bractRedDeep, FLORAL.bractRed, FLORAL.bractRedBright],
      edge: FLORAL.bractRedShadow,
      vein: FLORAL.veinRed,
      veinOpacity: 0.5,
      highlight: FLORAL.bractRed,
    },
    mid: {
      stops: [FLORAL.bractRedDeep, FLORAL.bractRed, FLORAL.bractRedBright, FLORAL.bractRedLight],
      edge: FLORAL.bractRedShadow,
      vein: FLORAL.veinRed,
      veinOpacity: 0.45,
      highlight: FLORAL.bractRedLight,
    },
    front: {
      stops: [FLORAL.bractRed, FLORAL.bractRedBright, FLORAL.bractRedLight, '#F4796A'],
      edge: FLORAL.bractRedDeep,
      vein: FLORAL.veinRed,
      veinOpacity: 0.38,
      highlight: '#F79C8F',
    },
    cyathia: [FLORAL.goldDeep, FLORAL.gold, FLORAL.goldLight],
  },
  white: {
    back: {
      stops: [FLORAL.bractWhiteShadow, FLORAL.bractWhiteDeep, FLORAL.bractWhite, FLORAL.bractWhiteBright],
      edge: '#B9AE99',
      vein: '#C6B99C',
      veinOpacity: 0.6,
      highlight: FLORAL.bractWhite,
    },
    mid: {
      stops: [FLORAL.bractWhiteDeep, FLORAL.bractWhite, FLORAL.bractWhiteBright, FLORAL.snow],
      edge: '#BFB49F',
      vein: '#CDBEA0',
      veinOpacity: 0.5,
      highlight: FLORAL.snow,
    },
    front: {
      stops: [FLORAL.bractWhite, FLORAL.bractWhiteBright, FLORAL.ivory, FLORAL.snow],
      edge: '#C8BDA8',
      vein: '#D5C7A6',
      veinOpacity: 0.42,
      highlight: FLORAL.snow,
    },
    cyathia: ['#9C8A2E', FLORAL.goldLight, FLORAL.pollen],
  },
  cream: {
    back: {
      stops: ['#D8C39A', FLORAL.bractCream, '#F2E2BC', FLORAL.bractCreamBright],
      edge: '#C9AE7C',
      vein: '#C4A870',
      veinOpacity: 0.55,
      highlight: '#F2E2BC',
    },
    mid: {
      stops: [FLORAL.bractCream, '#F6EAD0', FLORAL.bractCreamBright, FLORAL.ivory],
      edge: '#CDB285',
      vein: '#D6BE93',
      veinOpacity: 0.48,
      highlight: FLORAL.ivory,
    },
    front: {
      stops: ['#F8EED6', FLORAL.bractCreamBright, FLORAL.ivory, FLORAL.pollen],
      edge: '#D2BC94',
      vein: '#DDC9A2',
      veinOpacity: 0.4,
      highlight: FLORAL.snow,
    },
    cyathia: ['#A8871F', FLORAL.gold, FLORAL.goldPale],
  },
}

/** Green whorl struck behind the bracts, reusing the same silhouette. */
const FOLIAGE_SHADE: Shade = {
  stops: [FLORAL.leafShadow, FLORAL.leafDeep, FLORAL.leaf, FLORAL.leafBright],
  edge: FLORAL.leafShadow,
  vein: FLORAL.veinGreen,
  veinOpacity: 0.45,
  highlight: FLORAL.leafLight,
}

interface BractLayerProps {
  angles: number[]
  length: number
  width: number
  gradientId: string
  shade: Shade
  detail: 'high' | 'low'
  seed: number
  animatePetals: boolean
  duration: number
  delay: number
}

/**
 * One whorl of bracts. Every bract is drawn base-at-origin pointing up, so a
 * single userSpaceOnUse gradient maps base→tip inside each rotated group.
 */
function BractLayer({
  angles,
  length,
  width,
  gradientId,
  shade,
  detail,
  seed,
  animatePetals,
  duration,
  delay,
}: BractLayerProps) {
  return (
    <>
      {angles.map((angle, i) => {
        // Length and lean jitter are why this reads as a flower and not a star.
        const jitter = 0.94 + floralSeed(seed + i, length) * 0.11
        const lean = angle + (floralSeed(seed + i, width) - 0.5) * 5
        const bractLen = length * jitter
        const petalAnim = animatePetals && detail === 'high' && i % 3 === 0
        const petalDur = duration * (0.86 + floralSeed(seed + i, 3) * 0.4)

        return (
          <g key={`${angle.toFixed(1)}-${i}`} transform={`rotate(${lean.toFixed(2)})`}>
            <g>
              {petalAnim && (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="-1.1;1.1;-1.1"
                  dur={`${petalDur.toFixed(2)}s`}
                  begin={`${(-delay * 0.7 - i * 0.31).toFixed(2)}s`}
                  repeatCount="indefinite"
                  calcMode="spline"
                  keyTimes="0;0.5;1"
                  keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
                />
              )}
              <path
                d={bractPath(bractLen, width)}
                fill={`url(#${gradientId})`}
                stroke={shade.edge}
                strokeOpacity={0.45}
                strokeWidth={0.7}
                strokeLinejoin="round"
              />
              {detail === 'high' && (
                <>
                  <path
                    d={bractVeinPath(bractLen, width)}
                    fill="none"
                    stroke={shade.vein}
                    strokeOpacity={shade.veinOpacity}
                    strokeWidth={0.75}
                    strokeLinecap="round"
                  />
                  <path
                    d={bractHighlightPath(bractLen, width)}
                    fill={shade.highlight}
                    opacity={0.13}
                  />
                </>
              )}
            </g>
          </g>
        )
      })}
    </>
  )
}

interface PoinsettiaDecorationProps {
  /** Rendered width in px; the bloom is square. */
  size?: number
  variant?: PoinsettiaVariant
  /** Green leaves struck behind the coloured whorls. */
  foliage?: boolean
  glow?: boolean
  sparkles?: boolean
  /** In-SVG sway. Disabled automatically under prefers-reduced-motion. */
  sway?: boolean
  detail?: 'high' | 'low'
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
 * Layered Christmas poinsettia.
 *
 * Motion is SMIL inside the SVG rather than a class from globals.css, because
 * html2canvas serialises this markup into a standalone `data:` image where
 * external stylesheets cannot resolve. Sway rests at ±1.5°, so a download
 * frozen mid-animation still looks like a resting bloom.
 */
export default function PoinsettiaDecoration({
  size = 120,
  variant = 'red',
  foliage = true,
  glow = true,
  sparkles = false,
  sway = true,
  detail = 'high',
  angle = 0,
  seed = 1,
  duration = 7,
  delay = 0,
  x,
  y,
  className = '',
  style,
}: PoinsettiaDecorationProps) {
  const uid = useFloralUid(`poi-${variant}`)
  const reduced = useFloralReducedMotion()
  const spec = VARIANTS[variant]
  const animate = sway && !reduced

  // Width-to-length stays near 0.6: narrower whorls read as a star, not a bloom.
  const layers: Array<{ key: string; count: number; length: number; width: number; offset: number; shade: Shade }> = [
    { key: 'back', count: 7, length: 52, width: 34, offset: 25.7, shade: spec.back },
    { key: 'mid', count: 7, length: 62, width: 39, offset: 0, shade: spec.mid },
    { key: 'front', count: 6, length: 72, width: 44, offset: 12, shade: spec.front },
  ]

  return (
    <svg
      x={x}
      y={y}
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
        {layers.map((layer) => (
          <linearGradient
            key={layer.key}
            id={`${uid}-${layer.key}`}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="0"
            y2={-layer.length}
          >
            <stop offset="0%" stopColor={layer.shade.stops[0]} />
            <stop offset="42%" stopColor={layer.shade.stops[1]} />
            <stop offset="80%" stopColor={layer.shade.stops[2]} />
            <stop offset="100%" stopColor={layer.shade.stops[3]} />
          </linearGradient>
        ))}
        <linearGradient id={`${uid}-leaf`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="-84">
          <stop offset="0%" stopColor={FOLIAGE_SHADE.stops[0]} />
          <stop offset="40%" stopColor={FOLIAGE_SHADE.stops[1]} />
          <stop offset="80%" stopColor={FOLIAGE_SHADE.stops[2]} />
          <stop offset="100%" stopColor={FOLIAGE_SHADE.stops[3]} />
        </linearGradient>
        <radialGradient id={`${uid}-halo`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={FLORAL.goldLight} stopOpacity="0.3" />
          <stop offset="45%" stopColor={FLORAL.gold} stopOpacity="0.12" />
          <stop offset="100%" stopColor={FLORAL.gold} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-core`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={FLORAL.pollen} stopOpacity="0.8" />
          <stop offset="60%" stopColor={FLORAL.goldLight} stopOpacity="0.28" />
          <stop offset="100%" stopColor={FLORAL.gold} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-cup`} gradientUnits="userSpaceOnUse" x1="0" y1="5" x2="0" y2="-17">
          <stop offset="0%" stopColor={spec.cyathia[0]} />
          <stop offset="60%" stopColor={spec.cyathia[1]} />
          <stop offset="100%" stopColor={spec.cyathia[2]} />
        </linearGradient>
      </defs>

      <g transform={`translate(100 100) rotate(${angle})`}>
        {glow && <circle r="96" fill={`url(#${uid}-halo)`} />}

        <g>
          {animate && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="-1.5;1.5;-1.5"
              dur={`${duration}s`}
              begin={`${-delay}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            />
          )}

          {foliage && (
            <BractLayer
              angles={petalAngles(6, 40)}
              length={84}
              width={34}
              gradientId={`${uid}-leaf`}
              shade={FOLIAGE_SHADE}
              detail={detail}
              seed={seed + 40}
              animatePetals={false}
              duration={duration}
              delay={delay}
            />
          )}

          {layers.map((layer) => (
            <BractLayer
              key={layer.key}
              angles={petalAngles(layer.count, layer.offset)}
              length={layer.length}
              width={layer.width}
              gradientId={`${uid}-${layer.key}`}
              shade={layer.shade}
              detail={detail}
              seed={seed + layer.length}
              animatePetals={animate}
              duration={duration}
              delay={delay}
            />
          ))}

          {/* Cyathia — the actual flowers; the coloured stars are bracts. */}
          <circle r="26" fill={`url(#${uid}-core)`} />
          {petalAngles(6, 8).map((a, i) => (
            <g key={`cy-${i}`} transform={`rotate(${a})`}>
              <ellipse cx="0" cy="-11" rx="4.1" ry="5.4" fill={`url(#${uid}-cup)`} />
              <circle cx="0" cy="-16.5" r="1.9" fill={spec.cyathia[2]} />
              <circle cx="-1" cy="-17.4" r="0.6" fill={FLORAL.pollen} opacity="0.9" />
            </g>
          ))}
          {petalAngles(6, 38).map((a, i) => (
            <ellipse
              key={`cyb-${i}`}
              cx="0"
              cy="0"
              rx="2.4"
              ry="3.2"
              transform={`rotate(${a}) translate(0 -6.5)`}
              fill={spec.cyathia[1]}
              opacity="0.9"
            />
          ))}
          <circle cx="0" cy="0" r="2.6" fill={FLORAL.pollen} opacity="0.95" />
          <circle cx="4" cy="-3" r="1.5" fill={spec.cyathia[2]} opacity="0.85" />
          <circle cx="-4.5" cy="2.5" r="1.3" fill={spec.cyathia[2]} opacity="0.8" />
        </g>

        {sparkles &&
          [0, 1, 2, 3, 4].map((i) => {
            const sx = (floralSeed(seed + i, 7) - 0.5) * 168
            const sy = (floralSeed(seed + i, 11) - 0.5) * 150
            const r = 3 + floralSeed(seed + i, 13) * 4
            const dur = 2.6 + floralSeed(seed + i, 17) * 2.2
            return (
              <path
                key={`sp-${i}`}
                d={sparklePath(r)}
                transform={`translate(${sx.toFixed(1)} ${sy.toFixed(1)})`}
                fill={FLORAL.goldPale}
                opacity={animate ? 0.2 : 0.8}
              >
                {animate && (
                  <animate
                    attributeName="opacity"
                    values="0.15;0.9;0.15"
                    dur={`${dur.toFixed(2)}s`}
                    begin={`${(-i * 0.55).toFixed(2)}s`}
                    repeatCount="indefinite"
                  />
                )}
              </path>
            )
          })}
      </g>
    </svg>
  )
}
