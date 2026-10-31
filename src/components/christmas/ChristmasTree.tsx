'use client'

import React from 'react'
import PoinsettiaDecoration from './botanical/PoinsettiaDecoration'
import AnimatedHollyDecoration from './botanical/AnimatedHollyDecoration'
import EvergreenSprig from './botanical/EvergreenSprig'
import GoldenStar from './botanical/GoldenStar'
import { FLORAL } from './botanical/palette'
import { useFloralUid } from './botanical/useFloral'

interface ChristmasTreeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg'
  /** Botanical sprigs, poinsettias and gift boxes woven into the tree. */
  botanical?: boolean
}

const ORNAMENT_COLORS = [
  '#E74C3C', '#D4AF37', '#3498DB', '#E67E22', '#9B59B6', '#1ABC9C',
]

const ORNAMENT_POSITIONS: Array<[number, number]> = [
  [100, 65], [75, 105], [125, 105], [58, 152], [100, 145], [142, 152],
]

const LIGHT_POSITIONS: Array<[number, number]> = [
  [85, 80], [115, 80], [65, 120], [100, 118], [135, 120],
  [50, 162], [85, 162], [115, 162], [150, 162],
]

function GiftBox({
  x,
  y,
  scale,
  body,
  ribbon,
  shadeId,
  seed,
}: {
  x: number
  y: number
  scale: number
  body: string
  ribbon: string
  shadeId: string
  seed: number
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-20" y="-16" width="40" height="34" rx="3" fill={body} />
      <rect x="-23" y="-22" width="46" height="10" rx="3" fill={body} />
      <rect x="-20" y="-16" width="40" height="34" rx="3" fill={`url(#${shadeId})`} />
      <rect x="-23" y="-22" width="46" height="10" rx="3" fill={`url(#${shadeId})`} />
      <rect x="-4" y="-22" width="8" height="40" fill={ribbon} opacity="0.95" />
      <path
        d={`M-4,-22 C -12,-32 -22,-26 -14,-20 M4,-22 C 12,-32 22,-26 14,-20`}
        fill="none"
        stroke={ribbon}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <rect x="-20" y="-16" width="40" height="34" rx="3" fill="none" stroke="#02060D" strokeOpacity="0.25" />
      <animateTransform
        attributeName="transform"
        type="rotate"
        values={`0;${seed % 2 === 0 ? 1.4 : -1.4};0`}
        dur={`${7 + (seed % 3)}s`}
        repeatCount="indefinite"
        additive="sum"
        calcMode="spline"
        keyTimes="0;0.5;1"
        keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
      />
    </g>
  )
}

export default function ChristmasTree({
  className = '',
  size = 'md',
  botanical = true,
}: ChristmasTreeProps) {
  const uid = useFloralUid('tree')
  const dims = {
    sm: { box: 'w-28 h-32' },
    md: { box: 'w-44 h-52' },
    lg: { box: 'w-64 h-72' },
  }

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`} aria-hidden="true">
      {/* Star on top */}
      <GoldenStar
        size={size === 'lg' ? 62 : size === 'md' ? 48 : 34}
        className="floral-float mb-[-6px]"
        style={{ '--floral-duration': '6.5s' } as React.CSSProperties}
      />

      {/* Tree body — SVG for precision */}
      <svg
        viewBox="0 0 200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={dims[size].box}
        aria-label="Decorated Christmas tree"
      >
        <defs>
          <linearGradient id={`${uid}-tier1`} x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor={FLORAL.leafBright} />
            <stop offset="55%" stopColor={FLORAL.leaf} />
            <stop offset="100%" stopColor={FLORAL.leafDeep} />
          </linearGradient>
          <linearGradient id={`${uid}-tier2`} x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor={FLORAL.leaf} />
            <stop offset="60%" stopColor={FLORAL.leafDeep} />
            <stop offset="100%" stopColor={FLORAL.leafShadow} />
          </linearGradient>
          <linearGradient id={`${uid}-tier3`} x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor={FLORAL.leafBright} stopOpacity="0.9" />
            <stop offset="50%" stopColor={FLORAL.leafDeep} />
            <stop offset="100%" stopColor={FLORAL.leafShadow} />
          </linearGradient>
          <radialGradient id={`${uid}-orn`} cx="0.32" cy="0.28" r="0.8">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
          </radialGradient>
          <linearGradient id={`${uid}-trunkShade`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#02060D" stopOpacity="0.45" />
            <stop offset="55%" stopColor="#8B5A3C" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#02060D" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Tree layers */}
        <polygon points="100,10 155,90 45,90" fill={`url(#${uid}-tier1)`} />
        <polygon points="100,40 168,135 32,135" fill={`url(#${uid}-tier2)`} />
        <polygon points="100,75 180,185 20,185" fill={`url(#${uid}-tier3)`} />

        {/* Needle texture along the tier edges — reads as foliage rather than flat triangles */}
        {[
          'M100,10 L118,44 M100,10 L82,44 M128,66 L146,90 M72,66 L54,90',
          'M100,40 L124,88 M100,40 L76,88 M142,108 L168,135 M58,108 L32,135',
          'M100,75 L130,132 M100,75 L70,132 M152,158 L180,185 M48,158 L20,185',
        ].map((d, i) => (
          <path
            key={`needle-${i}`}
            d={d}
            stroke={FLORAL.leafLight}
            strokeOpacity="0.32"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        ))}

        {/* Trunk */}
        <rect x="85" y="185" width="30" height="30" rx="3" fill="#6B3A2A" />
        <rect x="85" y="185" width="30" height="30" rx="3" fill={`url(#${uid}-trunkShade)`} />

        {/* Ornaments */}
        {ORNAMENT_COLORS.map((color, i) => {
          const [cx, cy] = ORNAMENT_POSITIONS[i] ?? [100, 100]
          return (
            <g key={`orn-${i}`}>
              <circle cx={cx} cy={cy} r="7" fill={color} opacity="0.92">
                <animate
                  attributeName="opacity"
                  values="0.92;0.55;0.92"
                  dur={`${1.5 + i * 0.3}s`}
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx={cx} cy={cy} r="7" fill={`url(#${uid}-orn)`} />
              <path
                d={`M${cx},${cy - 7} L${cx},${cy - 11}`}
                stroke={FLORAL.goldLight}
                strokeWidth="1.4"
                opacity="0.8"
              />
            </g>
          )
        })}

        {/* Lights — small circles */}
        {LIGHT_POSITIONS.map(([cx, cy], i) => (
          <circle
            key={`light-${i}`}
            cx={cx}
            cy={cy}
            r="4"
            fill={['#E74C3C', '#F5D76E', '#3498DB', '#E67E22'][i % 4]}
          >
            <animate
              attributeName="r"
              values="4;5.5;4"
              dur={`${0.8 + i * 0.15}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="1;0.4;1"
              dur={`${0.8 + i * 0.15}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* Tinsel / garlands */}
        <path d="M55,90 Q100,80 145,90" stroke="#D4AF37" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M38,135 Q100,120 162,135" stroke="#D4AF37" strokeWidth="2" fill="none" opacity="0.6" />

        {/* Botanical layer, placed in tree units so it scales with the SVG */}
        {botanical && (
          <>
            {/* Nested groups place each bloom in tree units, so it scales with the SVG. */}
            <g transform="translate(35 155) scale(0.34) translate(-100 -100)">
              <PoinsettiaDecoration
                size={200}
                variant="red"
                foliage={false}
                glow
                detail="low"
                seed={5}
                duration={7.5}
                delay={0.4}
              />
            </g>
            <g transform="translate(152 116) scale(0.23) translate(-100 -100)">
              <PoinsettiaDecoration
                size={200}
                variant="white"
                foliage={false}
                glow={false}
                detail="low"
                seed={13}
                duration={6.8}
                delay={1.9}
              />
            </g>
            <g transform="translate(52 139) scale(0.42) translate(0 -130)">
              <AnimatedHollyDecoration
                width={170}
                height={130}
                leaves={3}
                berries={4}
                angle={-6}
                seed={21}
                duration={8.6}
                delay={1.2}
              />
            </g>
          </>
        )}
      </svg>

      {/* Gifts and a grounded spray below the tree */}
      <svg
        viewBox="0 0 200 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={size === 'lg' ? 'w-64 -mt-4' : size === 'md' ? 'w-44 -mt-3' : 'w-28 -mt-2'}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`${uid}-giftShade`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#02060D" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <ellipse cx="100" cy="54" rx="92" ry="7" fill="#02060D" opacity="0.5" />
        {botanical && (
          <g transform="translate(2 20) scale(0.3)">
            <EvergreenSprig
              width={200}
              height={110}
              nodes={6}
              detail="low"
              snow
              gold
              angle={4}
              seed={9}
              duration={11}
            />
          </g>
        )}
        <GiftBox
          x={58}
          y={34}
          scale={0.8}
          body={FLORAL.bractRed}
          ribbon={FLORAL.goldLight}
          shadeId={`${uid}-giftShade`}
          seed={1}
        />
        <GiftBox
          x={112}
          y={40}
          scale={0.62}
          body={FLORAL.leafDeep}
          ribbon={FLORAL.gold}
          shadeId={`${uid}-giftShade`}
          seed={2}
        />
        <GiftBox
          x={148}
          y={38}
          scale={0.55}
          body={FLORAL.gold}
          ribbon={FLORAL.bractRedDeep}
          shadeId={`${uid}-giftShade`}
          seed={3}
        />
      </svg>
    </div>
  )
}
